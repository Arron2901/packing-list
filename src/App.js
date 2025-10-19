import { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import config from './amplifyconfiguration.json';
import { createLocation } from './graphql/mutations';
import TopNavbar from './Components/navbar';
import LocationCards from './Components/LocationCards';
import ItemsTable from './Components/ItemsTable';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

Amplify.configure(config);
const client = generateClient();

function Home() {
  const [newLocation, setNewLocation] = useState("");
  const [refreshLocations, setRefreshLocations] = useState(false);
  const navigate = useNavigate();

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!newLocation.trim()) return;

    try {
      await client.graphql({
        query: createLocation,
        variables: { input: { location: newLocation } },
      });

      setNewLocation("");
      setRefreshLocations((prev) => !prev);
    } catch (error) {
      console.error("Error adding location: ", error);
    }
  };

  return (
    <div className="App">
      <TopNavbar />

      <form onSubmit={handleAddLocation} className="mt-5 d-flex justify-content-center">
        <input
          placeholder="Add New Location!"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          className="form-control me-2"
          style={{ maxWidth: "300px" }}
        />
        <button type="submit" className="btn btn-primary">Add Location</button>
      </form>

      <LocationCards refresh={refreshLocations} onView={(id, name) => navigate(`/items/${id}`, { state: { locationName: name } })}/>

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items/:locationId" element={<ItemsTable />} />
      </Routes>
    </Router>
  );
}
