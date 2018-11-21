import { Client} from 'pg';

const connectionString = 'postgres://postgres:@localhost:5433/sendit';


/**
 * This class handles Parcels Order controllers
 * */

class ParcelController {

    /**
     * This method gets all Parcels for Admin
     * @param {array} req - Admin request array
     * @param {array} res - Server response array
     * @returns {array} success or failure 
     */
    static getAllParcels(req, res) {
        console.log(req.user);
        const text = `SELECT * FROM parcels`;
        const getuser = `SELECT role FROM users WHERE role =$1 `;
        const client = new Client(connectionString);
        client.connect();
        client.query(getuser, [req.user.role])
            .then((result) => {
                if (result.rows[0].role === 'admin') {
                    const client = new Client(connectionString);
                    client.connect();
                    client.query(text)
                        .then((result) => {
                            res.status(200).json({
                                success: 'true',
                                message: 'Parcels retrieved successfully',
                                data: result.rows
                            });
                            client.end()
                        }).catch((err) => {
                            res.status(404).json({
                                message: 'Parcels not Found'
                            });
                            client.end()
                        });

                } else {
                    res.status(403).json({
                        message: 'FORBIDDEN'
                    })
                }
            }).catch((err) => {
                console.log(err)


            })
    }

    /**
     * This method create a new parcel order to the list of Parcels orders
     * @param {object} req - User request object
     * @param {object} res - server response Object
     * @returns {object} success or failure
     */
    static addParcels(req, res) {
        const getuser = `SELECT role FROM users WHERE role = $1 `;
        const text = `INSERT INTO parcels(
                firstName, lastName, deliveryAddress, deliveryLGA, deliveryState, 
                deliveryStreet, deliveryEmail,  deliveryPNumber, deliveryTime, 
                pickUpState, pickUpLGA , pickUpStreet, pickUpPhoneNumber, currentLocation,
                itemName,itemDescription,itemWeight,
                itemQuantity,userId, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10, $11, 
                    $12, $13, $14, $15, $16,$17,$18,$19, $20) 
                RETURNING *`
        const values = [
            req.body.firstName, req.body.lastName,req.body.deliveryAddress,
            req.body.deliveryLGA,req.body.deliveryState,req.body.deliveryStreet,
            req.body.deliveryEmail,req.body.deliveryPNumber,req.body.deliveryTime,
            req.body.pickUpState,req.body.pickUpLGA,req.body.pickUpStreet,
            req.body.pickUpPhoneNumber, req.body.currentLocation, req.body.itemName,req.body.itemDescription,
            req.body.itemWeight,req.body.itemQuantity, req.user.id, 'awaiting'];
        const client = new Client(connectionString);
        client.connect();
        console.log(req.user)
        client.query(getuser, [req.user.role])
        .then ((result) => {
            if (result.rows[0].role === 'user'){
                const client = new Client(connectionString);
                client.connect();
                client.query({text: text, values: values})
                .then((result) => {
                res.status(201).json({
                    message: 'Parcels created successfully',
                    data: result.rows[0]
                });
                client.end()
            })
            .catch((err) => {
                console.log(err)
                client.end()
            });
            }else{
                res.status(400).json({
                    message: 'Can\t create parcel'
                }) }
        }) .catch((err) => {
            console.log(err)
            client.end()})
        
    }

    
    /**
     * This method gets a particular Parcels on request for Admin
     * @param {object} req - User request object
     * @param {object} res - Server response Object
     * @returns {object} success or failure
     */
    static getAParcels(req, res) {
        const text = 'SELECT * FROM parcels WHERE id = $1 ';
        const getuser = `SELECT role FROM users WHERE role =$1 `;
        const client = new Client(connectionString);
        client.connect();
        client.query(getuser, [req.user.role])
        .then((result) => {
            if (result.rows[0].role === 'admin'){
               const client = new Client(connectionString);
               client.connect();
               client.query(text, [parseInt(req.params.parcelId, 10)])
                .then((result) => {
                    if (result.rows[0]) {
                            res.status(200).json({
                                success: 'true',
                                message: 'Parcel retrieved successfully',
                                data: result.rows[0]
                            });
                       
                        }else {
                        res.status(404).json({
                            message: "No valid entry found for provided ID"
                        });
                    }
                    client.end()
                }).catch((err) => {
                    res.status(500).json({
                        error: err.message
                    });
                    client.end()
                });
            }else{
                res.status(403).json({message: 'FORBIDDEN'})
            }
        }).catch((err) => {
            res.status(500).json({
                error: err.message}); client.end()
        });
       
    }    

}

export default ParcelController;