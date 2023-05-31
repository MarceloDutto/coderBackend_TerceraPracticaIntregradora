import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest('http://localhost:3000');

let userId_1;
let userId_2;
let productId;
let cartId;
let cookie_user1;
let cookie_user2;

const mockUser1 = {
    first_name: 'Juan',
    last_name: 'Dutto',
    age: 10,
    email: 'juandutto@test.com',
    password: 'juan123'
};
const mockUser2 = {
    first_name: 'Fran',
    last_name: 'Dutto',
    age: 42,
    email: 'frandutto@test.com',
    password: 'fran123'
};

describe('Testing e-commerce de coderBackend de Marcelo Dutto', () => {
    describe('Test de users', () => {

        beforeEach(function () {
            this.timeout(5000);
        });

        it('Se debe poder registrar un usuario correctamente', async () => {
            const result = await requester
                .post('/api/users')
                .send(mockUser1)

            const { statusCode, created, _body } = result;

            expect(statusCode).to.be.equal(201);
            expect(created).to.be.true;
            expect(_body.payload).to.have.property('id');
            expect(_body.payload).not.to.be.null;
            expect(_body.payload.name).to.be.equal(mockUser1.first_name);
            expect(_body.payload.lastname).to.be.equal(mockUser1.last_name);
            expect(_body.payload.email).to.be.equal(mockUser1.email);

            userId_1 = _body.payload.id;
        });

        it('El usuario se debe poder loguear', async () => {
            const mockLogin = {
                email: 'juandutto@test.com',
                password: 'juan123'
            };

            const result = await requester
                .post('/api/auth')
                .send(mockLogin)
            
            const cookieResult = result.headers['set-cookie'][0];
            expect(cookieResult).to.be.ok;

            cookie_user1 = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1].split(';')[0]
            };

            expect(cookie_user1.name).to.be.ok.and.eql('authToken');
            expect(cookie_user1.value).to.be.ok;
        });

        it('Se debe poder cambiar el rol del usuario a premium', async () => {
            const result = await requester
                .get(`/api/users/premium/${userId_1}`)
                .set('Cookie', [`${cookie_user1.name} =  ${cookie_user1.value}`])
            
            const { statusCode, ok, _body } = result;

            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.true;
            expect(_body.payload.role).to.be.equal('premium');
        });
    });

    describe('Test de products', () => {

        beforeEach(function () {
            this.timeout(5000);
        });

        it('Se debe poder crear un producto', async () => {
            const mockLogin = {
                email: 'juandutto@test.com',
                password: 'juan123'
            };

            const login = await requester
                .post('/api/auth')
                .send(mockLogin)

            const cookieResult = login.headers['set-cookie'][0];
            expect(cookieResult).to.be.ok;
    
            cookie_user1 = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1].split(';')[0]
            };

            const mockProduct = {
                name: 'Escritorio Madrid',
                description: 'MDF con pintura NC mate en blanco. Patas de madera de pino',
                category: 'escritorios',
                code: "escr-1",
                price: 194990,
                stock: 7
            };

            const result = await requester
                .post('/api/products')
                .set('Cookie', [`${cookie_user1.name} =  ${cookie_user1.value}`])
                .field('name', mockProduct.name)
                .field('description', mockProduct.description)
                .field('category', mockProduct.category)
                .field('code', mockProduct.code)
                .field('price', mockProduct.price)
                .field('stock', mockProduct.stock)
                .attach('file', './test/image-test.jpg')

                const { statusCode, created, _body } = result;

                expect(statusCode).to.be.equal(201);
                expect(created).to.be.true;
                expect(_body.payload).to.have.property('id');
                expect(_body.payload.name).to.be.equal(mockProduct.name);
                expect(_body.payload.description).to.be.equal(mockProduct.description);
                expect(_body.payload.category).to.be.equal(mockProduct.category);
                expect(_body.payload.code).to.be.equal(mockProduct.code);
                expect(_body.payload.price).to.be.equal(mockProduct.price.toLocaleString('es-AR', {style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 2}));
                expect(_body.payload.stock).to.be.equal(mockProduct.stock);
                expect(_body.payload.thumbnail).to.be.ok;

                productId = _body.payload.id;
        });

        it('Se debe poder obtener un producto por su id', async () => {
            const result = await requester
                .get(`/api/products/${productId}`)

            const { statusCode, ok, _body } = result;

            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.true;
            expect(_body.payload.id).to.be.equal(productId);
        });

        it('Se debe poder actualizar un producto', async () => {
            const updates = {
                name: 'Escritorio Roma',
                stock: 12
            };

            const result = await requester
                .patch(`/api/products/${productId}`)
                .set('Cookie', [`${cookie_user1.name} =  ${cookie_user1.value}`])
                .send(updates)

            const { statusCode, _body } = result;

            expect(statusCode).to.be.equal(200);
            expect(_body.payload).to.have.property('_id').and.is.equal(productId);
            expect(_body.payload.name).to.be.equal(updates.name);
            expect(_body.payload.stock).to.be.equal(updates.stock);
        });
    });

    describe('Test de carts', () => {

        beforeEach(function () {
            this.timeout(5000);
        });
        
        it('Se debe poder crear un carrito', async () => {
            const user2 = await requester
                .post('/api/users')
                .send(mockUser2)

            userId_2 = user2._body.payload.id;

            const mockLogin = {
                email: 'frandutto@test.com',
                password: 'fran123'
            };

            const login = await requester
                .post('/api/auth')
                .send(mockLogin)

            const cookieResult = login.headers['set-cookie'][0];
            expect(cookieResult).to.be.ok;
        
            cookie_user2 = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1].split(';')[0]
            };

            const result = await requester
                .post('/api/carts')
            
            expect(result.statusCode).to.be.equal(201);
            expect(result._body.payload).to.have.property('_id');

            cartId = result._body.payload._id;
        });

        it('Se debe poder agregar un producto al carrito', async () => {
            const result = await requester
                .post(`/api/carts/${cartId}/product/${productId}`)
                .set('Cookie', [`${cookie_user2.name} =  ${cookie_user2.value}`])

            expect(result.statusCode).to.be.equal(200);
        });

        it('Se debe poder eliminar un producto del carrito', async () => {
            const result = await requester
                .delete(`/api/carts/${cartId}/product/${productId}`)
                .set('Cookie', [`${cookie_user2.name} =  ${cookie_user2.value}`])
            
            const { statusCode, _body } = result;

            expect(statusCode).to.be.equal(200);
            expect(_body.message.message).to.be.equal('Producto eliminado del carrito');
        });
    });

    after(async function () {
        await requester
            .delete(`/api/products/${productId}`)
            .set('Cookie', [`${cookie_user1.name} =  ${cookie_user1.value}`])
        
        await requester
            .delete(`/api/users/${userId_1}`)
            .set('Cookie', [`${cookie_user1.name} =  ${cookie_user1.value}`])

        await requester
            .delete(`/api/users/${userId_2}`)
            .set('Cookie', [`${cookie_user2.name} =  ${cookie_user2.value}`])
    });
});