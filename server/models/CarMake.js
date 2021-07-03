import pg from "pg"
import _ from "lodash"

const pool = new pg.Pool({
  connectionString: "postgres://postgres:password@localhost:5432/car_associations_development"
})

class CarMake {
constructor({id, name}) {
    this.id = id
    this.name = name
  }

  static async findAll() {
    try {
      const result = await pool.query("SELECT * FROM car_makes;")

      //get the results
      const carMakeData = result.rows
      const carMakes = carMakeData.map(carMake => new this(carMake))

      return carMakes
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }

  static async findById(id) {
    try {
      const query = "SELECT * FROM car_makes WHERE id = $1;"
      const result = await pool.query(query, [id])

      //get the results
      const carMakeData = result.rows[0]
      const carMake = new this(carMakeData)

      return carMake
    } catch(err) {
      console.log(err)
      throw(err)
    }
  }

  async carModels() {
    const  carModelFile = await import("./CarModel.js")
    const CarModel = carModelFile.default

    try {
      const query = `SELECT * FROM car_models WHERE car_make_id = $1;`
      const result = await pool.query(query, [this.id])

      const relatedCarModelsData = result.rows
      const relatedCarModels = relatedCarModelsData.map(carModel => new CarModel(carModel))

      return relatedCarModels
      
    } catch (error) {
      console.log(error)
      throw (error)
    }
  }
}

export default CarMake