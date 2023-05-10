import { faker } from "@faker-js/faker";

faker.locale = 'es';

export const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        code: faker.datatype.uuid(),
        price: faker.commerce.price(5000, 45000, 0),
        thumbnail: [faker.image.imageUrl()],
        stock: faker.datatype.number({max: 50})
    }
};