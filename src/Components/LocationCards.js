import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import config from '../amplifyconfiguration.json';
import { listLocations } from '../graphql/queries';
import { deleteLocation } from '../graphql/mutations';

Amplify.configure(config);
const client = generateClient();

function LocationCards({ refresh, onView }) {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const result = await client.graphql({ query: listLocations });
                const items = result.data.listLocations.items;
                setLocations(items);
            } catch (err) {
                console.error('Error fetching locations:', err);
            }
        };

        fetchLocations();
    }, [refresh]);

    const handleDeleteLocation = async (id) => {
        try {
            await client.graphql({
                query: deleteLocation,
                variables: { input: { id } },
            });
            setLocations((prev) => prev.filter((loc) => loc.id !== id));
        } catch (error) {
            console.error("Error deleting location:", error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row g-3">
                {locations.map((loc) => (
                    <div key={loc.id} id={loc.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div className="card text-white bg-danger h-100 d-flex align-items-center justify-content-center" style={{ minHeight: "120px" }}>
                            <div className="card-body text-center">
                                <h5 className="card-title">{loc.location}</h5>
                                <div className="d-flex justify-content-center gap-2 mt-2">
                                    <button className="btn btn-light" onClick={() => handleDeleteLocation(loc.id)}>Delete</button>
                                    <button className="btn btn-dark" onClick={() => onView(loc.id, loc.location)}>View</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LocationCards;
