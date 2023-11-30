import { Router, Request, Response } from "express";
import { ProductErrors } from "../common/errors";

const router = Router();
import { ProductModel } from "../models/product";
import { UserModel } from "../models/user";
import { verifyToken } from "./user";

router.get("/", async (_, res: Response) => {
  const products = await ProductModel.find({});

  res.json({ products });
});

router.post("/checkout", verifyToken, async (req: Request, res: Response) => {
  const { customerID, cartItems } = req.body;
  try {
    const user = await UserModel.findById(customerID);

    const productIDs = Object.keys(cartItems);// this will give an array of the ids of the products in cartitems
    const products = await ProductModel.find({ _id: { $in: productIDs } }); // here we find products (in db) whose _id is in products
                             //products having id , that is inside the product id
    if (!user) {
      return res.status(400).json({ type: ProductErrors.NO_USERS_FOUND });
    }
    if (products.length !== productIDs.length) {
      return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
    }

    let totalPrice = 0;
    for (const item in cartItems) {
      const product = products.find((product) => String(product._id) === item);
      if (!product) {
        return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
      }

      if (product.stockQuantity < cartItems[item]) {
        return res.status(400).json({ type: ProductErrors.NOT_ENOUGH_STOCK }); // check for availability
      }

      totalPrice += product.price * cartItems[item];
    }

    if (user.availableMoney < totalPrice) {
      return res.status(400).json({ type: ProductErrors.NO_AVAILABLE_MONEY }); // check for avaible money
    }

    user.availableMoney -= totalPrice;// from here the transcation will happen  , in this line-> we are updating tthe money
    user.purchasedItems.push(...productIDs); // updating the PURCHASED items LIST 

    await user.save();
    await ProductModel.updateMany(
      { _id: { $in: productIDs } },
      { $inc: { stockQuantity: -1 } } // UPDATING THE STOCK QUANTITY
    );

    res.json({ purchasedItems: user.purchasedItems });
  } catch (error) {
    console.log(error);
  }
});
// API to get the purchased items per customer
router.get(
  "/purchased-items/:customerID",
  verifyToken,
  async (req: Request, res: Response) => {
    const { customerID } = req.params;
    try {
      const user = await UserModel.findById(customerID);

      if (!user) {
        return res.status(400).json({ type: ProductErrors.NO_USERS_FOUND });
      }

      const products = await ProductModel.find({
        _id: { $in: user.purchasedItems },  // finding products whose _id is  in the user.purchaseditems id
      });

      res.json({ purchasedItems: products });
    } catch (error) {
      res.status(400).json({ type: ProductErrors.NO_USERS_FOUND });
    }
  }
);

export { router as productRouter };
