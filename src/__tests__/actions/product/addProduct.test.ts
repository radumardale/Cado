import { Categories } from "@/lib/enums/Categories";
import { Ocasions } from "@/lib/enums/Ocasions";
import { ProductContent } from "@/lib/enums/ProductContent";
import { appRouter } from "@/server";
import { addProductResponseInterface } from "@/server/procedures/product/addProduct";
import { assert, expectTypeOf, test } from "vitest";


test.skip("addProduct", async () => {
    const caller = appRouter.createCaller({});
    for (let i = 0; i < 16; i++) {
      const res = await caller.products.createProduct({
          data: {
            title: {
                ro: "Set cadou White Gold-" + i,
                ru: "Пример продукта-" + i
              },
              description: {
                ro: "Setul cadou „Christmas Fairytale” este o alegere excelentă pentru cei dragi, familie, prieteni sau parteneri de afaceri.\nEste ideal pentru a crea amintiri speciale de Crăciun și a oferi un sentiment unic de bucurie și recunoștință. De asemenea, este perfect pentru companii care doresc să impresioneze partenerii sau echipa.",
                ru: "Описание примера продукта"
              },
              price: Math.round(Math.random() * 3000 + 1000),
              categories: [i % 2 == 0 ? Categories.ACCESSORIES : Categories.FLOWERS_AND_BALLOONS, i % 2 == 0 ? Categories.FOR_HER : Categories.FOR_HIM],
              ocasions: [i % 2 == 0 ? Ocasions.CHRISTMAS_GIFTS : Ocasions.EASTER_GIFTS, i % 2 == 0 ? Ocasions.FEBRUARY_23 : Ocasions.FOR_HOME_AND_OFFICE],
              product_content: [ProductContent.CHOCOLATE_BISCUITS_CANDY, ProductContent.ACCESSORIES_FOR_TEA_COFFEE],
              stock_availability: 100,
              images: [],
              sale: {
                active: false,
                sale_price: 80.0
              }
          }
      });

      assert(res.success === true, res.error);

      expectTypeOf(res).toEqualTypeOf<addProductResponseInterface>();
    }
})