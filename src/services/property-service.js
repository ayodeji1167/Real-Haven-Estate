/* eslint-disable no-shadow */
/* eslint-disable no-continue */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const PropertyModel = require('../models/property-model');
const { uploadSingleFile } = require('../config/cloudinary');
const { UPLOAD_PATH } = require('../config/constants');
const BadRequestError = require('../error/errors');

class PropertyService {
  createProperty = async (req) => {
    /**
     * req.files returns an object with array of files
     * mainImage is the key and value is array of files
     * file is the key and value  is array of files
     * const files =  {mainImage: [file1,file2], file:[file1,file2]}
     */

    console.log('got here')
    const files = await req.files;

    console.log(files);
    const otherImagesUrl = [];
    const otherImagesPublicId = [];

    // // Save The Main Image
    // const { secure_url, public_id } = await uploadSingleFile(
    //   mainImage[0].path,
    //   UPLOAD_PATH.PROPERTY_IMAGES,

    //   'image',
    // );
    // const mainImageUrl = secure_url;
    // const mainImagePublicId = public_id;

    // Save Other Images
    for (const image of files) {
      const { secure_url, public_id } = await uploadSingleFile(
        image.path,
        UPLOAD_PATH.PROPERTY_IMAGES,
        'image',
      );
      otherImagesUrl.push(secure_url);
      otherImagesPublicId.push(public_id);
    }

    // Save Property To DB
    const property = await PropertyModel.create({
      ...req.body,
      // mainImage: {
      //   url: mainImageUrl,
      //   cloudinaryId: mainImagePublicId,
      // },
      otherImages: {
        url: otherImagesUrl,
        cloudinaryId: otherImagesPublicId,
      },

    });
    return property;
  };

  getPropertyById = async (req) => {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError('Please Input Property Id');
    }
    const property = await PropertyModel.findById(id);
    return property;
  };

  updateProperty = async (req) => {
    const { params } = req;
    const updateObj = {
      'location.state': 'England',
      // ...body,

    };
    const updated = await PropertyModel.findByIdAndUpdate(params.id, updateObj, { new: true });
    return updated;
  };

  getAllProperties = async (req) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const pageNo = Number(req.query.pageNo) || 1;
    const noToSkip = (pageNo - 1) * pageSize;

    // const queryObject = await this.getQueryObject(req);
    const queryObject = { stateOfBuilding: { $all: ['Furnished', 'Serviced'] } };
    console.log(queryObject);
    const properties = await PropertyModel.find(queryObject).sort({ createdAt: -1 })
      .skip(noToSkip).limit(pageSize);
    const noOfProperties = await PropertyModel.countDocuments(queryObject);
    return { properties, noOfProperties, pageNo };
  };

  getQueryObject = async (req) => {
    const {
      noOfBedroom,
      noOfBathroom,
      search,
      minPrice,
      maxPrice,
      noOfToilet,
      stateOfBuilding,
      state,
      city,
      purpose,
    } = req.query;

    const queryObject = {};

    if (search) {
      const searchRegex = new RegExp(search, 'gi');
      queryObject.title = searchRegex;
    }
    if (minPrice || maxPrice) {
      queryObject.price = { $lte: maxPrice || 1000000000, $gte: minPrice || 0 };
    }
    if (state) {
      queryObject['location.state'] = state;
    }
    if (purpose) {
      queryObject.purpose = purpose;
    }
    if (noOfBathroom) {
      queryObject.noOfBathroom = noOfBathroom;
    }
    if (noOfBedroom) {
      queryObject.noOfBedroom = noOfBedroom;
    }
    if (noOfToilet) {
      queryObject.noOfToilet = noOfToilet;
    }
    if (stateOfBuilding) {
      queryObject.stateOfBuilding = stateOfBuilding;
    }
    if (city) {
      queryObject['location.city'] = city;
    }
    return queryObject;
  };
}

module.exports = new PropertyService();
