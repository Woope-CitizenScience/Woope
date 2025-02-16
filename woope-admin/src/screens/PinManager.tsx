import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { getPins, updatePin, deletePin, searchPins } from "../api/pins";

const PinManager = () => {
  const [pins, setPins] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredPins, setFilteredPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const [editData, setEditData] = useState({
    name: "",
    text_description: "",
    dateBegin: "",
    label: "",
    longitude: 0,
    latitude: 0,
  });

  useEffect(() => {
    fetchPins();
  }, []);

  const fetchPins = async () => {
    try {
      const res = await getPins();
      setPins(res);
      setFilteredPins(res); // Show all pins by default
    } catch (e) {
      console.error("Error fetching pins:", e);
    }
  };

  const handleSearch = async () => {
    if (!searchInput) {
      setFilteredPins(pins); // Reset filter if empty
      return;
    }
    try {
      const res = await searchPins(searchInput);
      setFilteredPins(res);
    } catch (e) {
      console.error("Error searching pins:", e);
    }
  };

  const handleEdit = (pin: any) => {
    setSelectedPin(pin);
    setEditData({
      name: pin.name,
      text_description: pin.text_description,
      dateBegin: pin.datebegin,
      label: pin.label,
      longitude: pin.longitude,
      latitude: pin.latitude,
    });
  };

  const handleDelete = (pin: any) => {
    setSelectedPin(pin);
  };

  const confirmEdit = async () => {
    try {
      await updatePin(selectedPin.pin_id, editData);
      fetchPins();
      alert("Pin updated successfully.");
    } catch (e) {
      console.error("Error updating pin:", e);
    }
  };

  const confirmDelete = async () => {
    try {
      await deletePin(selectedPin.pin_id);
      fetchPins();
      alert("Pin deleted successfully.");
    } catch (e) {
      console.error("Error deleting pin:", e);
    }
  };

  return (
    <div className="container-lg">
      {/* Edit Pin Modal */}
      <Modal
        id="editPinModal"
        title="Edit Pin"
        body={
          <>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
            <textarea
              className="form-control mb-2"
              placeholder="Description"
              value={editData.text_description}
              onChange={(e) => setEditData({ ...editData, text_description: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Label"
              value={editData.label}
              onChange={(e) => setEditData({ ...editData, label: e.target.value })}
            />
            <input
              type="datetime-local"
              className="form-control mb-2"
              value={editData.dateBegin}
              onChange={(e) => setEditData({ ...editData, dateBegin: e.target.value })}
            />
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Longitude"
              value={editData.longitude}
              onChange={(e) => setEditData({ ...editData, longitude: parseFloat(e.target.value) })}
            />
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Latitude"
              value={editData.latitude}
              onChange={(e) => setEditData({ ...editData, latitude: parseFloat(e.target.value) })}
            />
          </>
        }
        footer={
          <button className="btn btn-primary" onClick={confirmEdit} data-bs-dismiss="modal">
            Save Changes
          </button>
        }
      />

      {/* Delete Confirmation Modal */}
      <Modal
        id="deletePinModal"
        title="Confirm Delete"
        body={<p>Are you sure you want to delete this pin?</p>}
        footer={
          <button className="btn btn-danger" onClick={confirmDelete} data-bs-dismiss="modal">
            Delete
          </button>
        }
      />

      <h1 className="pb-4">Pin Manager</h1>
      <hr />

      {/* Search Bar BELOW the Title */}
      <div className="row mb-3">
        <div className="col-sm-4">
          <input
            type="text"
            className="form-control"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Pins by Content"
          />
        </div>
        <div className="col-sm-3">
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      <Table
        headers={["ID", "Name", "Description", "Longitude", "Latitude", "Actions"]}
        rows={filteredPins.map((pin: any) => [
          "" + pin.pin_id,
          pin.name,
          pin.text_description,
          pin.longitude.toFixed(6),
          pin.latitude.toFixed(6),
          <>
            <button
              className="me-2 btn btn-primary"
              onClick={() => handleEdit(pin)}
              data-bs-toggle="modal"
              data-bs-target="#editPinModal"
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(pin)}
              data-bs-toggle="modal"
              data-bs-target="#deletePinModal"
            >
              Delete
            </button>
          </>,
        ])}
      />
    </div>
  );
};

export default PinManager;
