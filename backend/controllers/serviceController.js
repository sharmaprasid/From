const Service = require("../models/service");
const data = require("../utils/Data");

exports.initializeServices = async (req, res) => {
  try {
    await Service.insertMany(data);
    res.status(201).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.createService = async (req, res) => {
  try {
    const { serviceCategory, serviceNames } = req.body;

    const existingCategory = await Service.findOne({ serviceCategory });

    if (existingCategory) {
      existingCategory.serviceNames.push(serviceNames);
      await existingCategory.save();
      res.status(200).json(existingCategory);
    } else {
      const service = new Service({
        serviceCategory,
        serviceNames: [serviceNames],
      });
      await service.save();
      res.status(201).json(service);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { serviceCategory, serviceNames } = req.body;
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { serviceCategory, serviceNames },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndRemove(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
