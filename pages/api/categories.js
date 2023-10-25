import { mongooseConnect } from "@/lib/ mongoose";
import { Category } from "@/models/Category";

export default async function handle(req,res){
    const {method}= req;
    await mongooseConnect();

    if(method === 'GET'){
        res.json(await Category.find().populate('parent'))
        
    }

    if (method === 'POST') {
        const { name, parentCategory } = req.body;
        const data = {
            name,
            parent: parentCategory ? parentCategory : null, // Establece null si no se proporciona un valor válido
        };
        const categoryDoc = await Category.create(data);
        res.json(categoryDoc);
    }

    if(method === 'PUT'){
        const {name, parentCategory, _id}= req.body;
       const categoryDoc = await Category.updateOne({_id},{
        name,
        parent: parentCategory
    })
    res.json(categoryDoc);
  } 

  if(method === 'DELETE'){
    const {_id}= req.query;
    await Category.deleteOne({_id});
    res.json('ok');
  }
}
