const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server'); // Adjust the path to your Express app file
const Concert = require('../../../models/concert.model'); // Adjust the path to your Concert model file

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('Concert API - GET', () => {
    // Before hook to add a test concert before testing
    before(async () => {
        const testConcert = new Concert({
            performer: 'Test Performer',
            genre: 'Test Genre',
            price: 100,
            day: 1,
            Image: 'test.jpg',
        });
        await testConcert.save();
    });
    

    // Test cases for GET endpoints
    describe('GET /api/concerts', () => {
        it('should get all concerts', async () => {
            const res = await request(server).get('/api/concerts');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
        });

        it('should return one concerts by :id', async () => {
          const concerts = await Concert.find();
          const concertId = concerts[0].id;
          const res = await request(server).get(`/api/concerts/${concertId}`);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body._id).to.equal(concertId.toString());
        });

        it('should return performer by /performer/:performer', async () => {
          const performerName = 'Test Performer';
          const res = await request(server).get(`/api/concerts/performer/${performerName}`);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
        });

        it('should return all concerts by :genre', async () => {
          const genreName = 'Test Genre';
          const res = await request(server).get(`/api/concerts/genre/${genreName}`);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
        });

        it('should return concerts within a price range', async () => {
          const priceMin = 50;
          const priceMax = 150;
          const res = await request(server).get(`/api/concerts/price/${priceMin}/${priceMax}`);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
        });

        it('should return all concerts in chosen :day', async () => {
          const day = 1;
          const res = await request(server).get(`/api/concerts/day/${day}`);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
        }); 

    });

    // After hook to clean up the test data
    after(async () => {
        await Concert.deleteMany(); // zmienić na usunięcie pojedyńczego koncertu
    });
});