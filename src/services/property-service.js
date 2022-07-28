/* eslint-disable no-shadow */
/* eslint-disable no-continue */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const PropertyModel = require('../models/property-model');
// const { uploadSingleFile } = require('../config/cloudinary');
// const { UPLOAD_PATH } = require('../config/constants');
const BadRequestError = require('../error/bad-request-error');

class PropertyService {
  createProperty = async (req) => {
    /**
     * req.files returns an object with array of files
     * mainImage is the key and value is array of files
     * file is the key and value  is array of files
     * const files =  {mainImage: [file1,file2], file:[file1,file2]}
     */
    // const { mainImage, file } = req.files;

    // const otherImagesUrl = [];
    // const otherImagesPublicId = [];

    // // Save The Main Image
    // const { secure_url, public_id } = await uploadSingleFile(mainImage[0].path,
    //  UPLOAD_PATH.PROPERTY_IMAGES, 'image');
    // const mainImageUrl = secure_url;
    // const mainImagePublicId = public_id;

    // // Save Other Images
    // for (const image of file) {
    //   const { secure_url, public_id } = await uploadSingleFile(
    //     image.path,
    //     UPLOAD_PATH.PROPERTY_IMAGES,
    //     'image',
    //   );
    //   otherImagesUrl.push(secure_url);
    //   otherImagesPublicId.push(public_id);
    // }

    // Save Property To DB
    const property = await PropertyModel.create({
      ...req.body,
      // mainImage: {
      //   url: mainImageUrl,
      //   cloudinaryId: mainImagePublicId,
      // },
      // otherImages: {
      //   url: otherImagesUrl,
      //   cloudinaryId: otherImagesPublicId,
      // },

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

  getAllProperties = async (req) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const pageNo = Number(req.query.pageNo) || 1;
    const noToSkip = (pageNo - 1) * pageSize;

    const {
      noOfBedroom, noOfBathroom,
      price, noOfToilet, stateOfBuilding, state, city, purpose,
    } = req.query;

    const queryObject = {};

    if (state) {
      queryObject['location.state'] = state;
    }
    if (noOfBathroom) {
      queryObject.noOfBathroom = noOfBathroom;
    }
    if (city) {
      queryObject.city = city;
    }

    console.log(queryObject);
    const properties = await PropertyModel.find(queryObject).sort({ createdAt: -1 })
      .skip(noToSkip).limit(pageSize);
    const noOfProperties = await PropertyModel.countDocuments(queryObject);
    return { properties, noOfProperties, pageNo };
  };
}

module.exports = new PropertyService();
