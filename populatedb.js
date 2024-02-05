#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/Category");
const Item = require("./models/Item");

const categories = [],
  items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(index, name, description, category, price, in_stock) {
  const item = new Item({
    name: name,
    description: description,
    category: category,
    price: price,
    in_stock: in_stock
  })

  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding Categories");
  await Promise.all([
    categoryCreate(0, "Eye-glasses", "Want something to cover your eyes? Here it is"),
    categoryCreate(1, "Top-wear", "Amazing top wear for both men and women"),
    categoryCreate(2, "Lower-wear", "Lower wear for both men and women"),
  ]);
}


async function createItems() {
  console.log("Adding Items");
  await Promise.all([
    itemCreate(0, "Brown Sunglasses", "Protect Your eyes from sun and its violet rays with brown shade", categories[0], 29, 8),
    itemCreate(1, "Red Sunglasses", "Protect Your eyes from sun and its violet rays with red shade", categories[0], 19, 2),
    itemCreate(2, "Yellow Sunglasses", "Protect Your eyes from sun and its violet rays with yellow shade", categories[0], 30, 6),
    itemCreate(3, "Tank Top", "Show off your muscles at gym with this", categories[1], 14, 3),
    itemCreate(4, "T-shirt", "Take a look at this anywhere-to-wear tshirt design", categories[1], 9, 10),
    itemCreate(5, "Shirt", "Get a formal party incoming ? This shirt will be perfect for it!", categories[1], 25, 5),
    itemCreate(6, "Shorts", "For your casual homewear , we got you covered right here", categories[2], 8, 10),
    itemCreate(7, "Pant" , "For your incoming formal party , have a look at this formal pant" , categories[2], 16 , 9),
    itemCreate(8, "Panties" , "For some fun in your bed" , categories[2], 20 , 6)
  ]);
  console.log(`Reference : ${categories[2]}`)
}

