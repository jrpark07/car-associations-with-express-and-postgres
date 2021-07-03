import pg from "pg"
import _ from "lodash"

const pool = new pg.Pool({
    connectionString: "postgres://postgres:password@localhost:5432/car_associations_development"
})

class CarModel {
constructor({ id, name, carMakeId, car_make_id }) {
        this.id = id
        this.name = name
        this.carMakeId = carMakeId || car_make_id
    }

    static async findAll() {
        try {
            const result = await pool.query("SELECT * FROM car_models;")

            const carModelData = result.rows
            const carModels = carModelData.map(carModel => new this(carModel))

            return carModels

        } catch (error) {
            console.log(error)
            throw (error)
        }
    }

    static async findById(id) {
        try {
            const query = "SELECT * FROM car_models WHERE id = $1;"
            const result = await pool.query(query, [id])

            const carModelData = result.rows[0]
            const carModel = new this(carModelData)

            return carModel

        } catch (error) {
            console.log(error)
            throw (error)
        }
    }

    async carMake() {
        const carMakeFile = await import("./CarMake.js")
        const CarMake = carMakeFile.default

        try {
            const query = `SELECT * FROM car_makes WHERE id = $1;`
            const result = await pool.query(query, [this.carMakeId])

            const relatedCarMakeData = result.rows[0]
            const relatedCarMake = new CarMake(relatedCarMakeData)

            return relatedCarMake

        } catch (error) {
            console.log(error)
            throw (error)
        }
    }
}

export default CarModel
