const cloudinary = require('cloudinary');
const constants = require('./constants');

cloudinary.v2.config({
  cloud_name: constants.CLOUDINARY.NAME,
  api_key: constants.CLOUDINARY.API_KEY,
  api_secret: constants.CLOUDINARY.SECRET_KEY,
});

const uploadSingleFile = async (filePath, section = 'IMAGE', resourceType = 'auto') => {
  const imageUpload = await cloudinary.v2.uploader.upload(filePath, { folder: `HAVEN/${section}`, resourceType: `${resourceType}` });
  return imageUpload;
};

const deleteFromCloud = async (publicId, resourceType) => {
  await cloudinary.v2.uploader.destroy(publicId, {
    resource_type: `${resourceType}`,
  });
  return 'File Deleted Successfully';
};

const deleteMultiple = async (publicIds, resourceType) => {
  await cloudinary.v2.api.delete_resources(publicIds, { resource_type: `${resourceType}` });
  return 'All Files Deleted Successfully';
};

module.exports = { uploadSingleFile, deleteFromCloud, deleteMultiple };
