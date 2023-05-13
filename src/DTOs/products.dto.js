export default class productsDTO {
    constructor(doc) {
        this.id = doc._id,
        this.name = doc.name,
        this.description = doc.description,
        this.category = doc.category,
        this.code = doc.code,
        this.stock = doc.stock,
        this.price = doc.price.toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        this.thumbnail = doc.thumbnail,
        this.owner = doc.owner
    }
};
