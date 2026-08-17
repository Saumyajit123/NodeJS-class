const IndexType = require("../../models/indexModel");
const StatusCode = require("../../utils/statusCode");

class IndexController {
  // Create index:
  async creatIndex(req, res) {
    const { username, firstname, lastname, tags, bio, location, isActive } =
      req.body;

    try {
      const newIndex = new IndexType({
        username,
        firstname,
        lastname,
        tags,
        bio,
        location,
        isActive,
      });

      const savedIndex = await newIndex.save();
      return res.status(StatusCode.CREATED).json({
        message: "Index created",
        data: savedIndex,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: "Internal Server error",
      });
    }
  }

  // Find by username: (Single field + unique index)
  async getIndex(req, res) {
    try {
      const username = req.params.username;

      const index = await IndexType.findOne({ username });

      if (!index) {
        return res.status(StatusCode.BAD_REQUEST).json({
          message: "Index not found",
        });
      }

      return res.status(StatusCode.OK).json({
        message: "Index retrieved",
        data: index,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: "Internal Server error",
      });
    }
  }

  // Compound index:
  async compoundIndexes(req, res) {
    try {
      const { firstname, lastname } = req.query;
      const indexes = await IndexType.find({ firstname, lastname });

      return res.status(StatusCode.OK).json({
        message: "Indexes retrived",
        data: indexes,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: "Internal Server error",
      });
    }
  }

  // Text index:
  async textIndex(req, res) {
    try {
      const users = await IndexType.find({
        $text: { $search: req.params.keyword },
      });
      return res.status(StatusCode.OK).json({
        message: "Indexes retrived",
        data: users,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: "Internal Server error",
      });
    }
  }

  // Geospatial index:
  async geospatialIndex(req, res) {
    try {
      const { lat, lng, maxDistance } = req.query;
      const users = await IndexType.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: parseInt(maxDistance) || 1000,
          },
        },
      });

      return res.status(StatusCode.OK).json({
        message: "Nearby users retrieved",
        data: users,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: "Internal Server error",
      });
    }
  }

  // Partial index:
  async partialIndex(req, res) {
    try {
      const user = await IndexType.find({ isActive: true });
      return res.status(StatusCode.OK).json({
        message: "Users retrieved",
        data: user,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: "Internal Server error",
      });
    }
  }
}

module.exports = new IndexController();
