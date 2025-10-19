import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import config from "../amplifyconfiguration.json";
import { listItems } from "../graphql/queries";
import { createItem, deleteItem, updateItem } from "../graphql/mutations";
import TopNavbar from "./navbar";

Amplify.configure(config);
const client = generateClient();

function ItemsTable() {
    const { locationId } = useParams();
    const { state } = useLocation();
    const locationName = state?.locationName || "this location";
    const [refreshItems, setRefreshItems] = useState(false);
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState("")
    const [noItemsPacked, setNoItemsPacked] = useState(0)
    const [packedPercentage, setPackedPercentage] = useState(0)

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const result = await client.graphql({ query: listItems });
                const items = result.data.listItems.items;
                const itemsForLocation = items.filter(item => item.locationId === locationId);
        
                setItems(itemsForLocation);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, [locationId, refreshItems]);

    useEffect(() => {
        const count = items.filter(item => item.packed).length
        setNoItemsPacked(count)
        const percentage = items.length === 0 ? 100 : Math.round((count / items.length) * 100);
        setPackedPercentage(percentage);
    }, [items])


    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        try {
            await client.graphql({
            query: createItem,
            variables: {
                input: { locationId: locationId, name: newItem, quantity: 0, packed: false },
            },
            });

            setNewItem("");              
            setRefreshItems((prev) => !prev);
        } catch (error) {
            console.error("Error adding item to database: ", error);
        }
    };


    const handleDeleteItem = async (id) => {
        try {
            await client.graphql({
                query: deleteItem,
                variables: { input: { id } },
            });

            setItems((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Error deleting item: ", error)
        }
    }


    const handleUpdateItem = async (id, checked) => {
        try {
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, packed: checked } : item
                )
            )

            await client.graphql({
                query: updateItem,
                variables: {
                    input: { id: id, packed: checked }
                }
            })
        } catch (error) {
            console.error("Failed to update item: ", error)
        }
        
    }


    return (
        <div>
            <TopNavbar />
            <div className="container mt-5 text-center">
                <h2 className="mb-4">Items for {locationName}</h2>

                <form onSubmit={handleAddItem} className="mt-5 d-flex justify-content-center">
                    <input placeholder="Add New Item" value={newItem} onChange={(e) => setNewItem(e.target.value)} className="form-control me-2" style={{ maxWidth: "300px" }}/>
                    <button type="submit" className="btn btn-primary">Add Item</button>
                </form>

                <div className="container mt-5 text-center">
                    <h3 id="itemsPackedTitle">Items Packed</h3>
                    <h5 id="itemsPackedStats">{noItemsPacked}/{items.length} ({packedPercentage}%)</h5>
                </div>

                <table className="table table-bordered mx-auto text-center mt-5" style={{ fontSize: "1.2rem", padding: "1rem" }}>
                    <thead className="table-light">
                        <tr>
                            <th>Item name</th>
                            <th>Packed</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                        <tr>
                            <td colSpan="3">No items found.</td>
                        </tr>
                        ) : (
                        items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td><input type="checkbox" checked={item.packed} onChange={(e) => {handleUpdateItem(item.id, e.target.checked)}} style={{ transform: "scale(1.5)" }}/></td>
                                <td><button className="btn btn-danger" onClick={() => handleDeleteItem(item.id)}>Delete</button></td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
  );
}

export default ItemsTable;
