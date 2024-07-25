import {Camera, CameraResultType} from '@capacitor/camera';

const CameraComponent = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri
  });

  // Assuming you have an image element with id 'imageElement' in your HTML
  const imageElement = document.getElementById('imageElement') as HTMLImageElement;

  if (imageElement) {
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    // Can be set to the src of an image now
    imageElement.src = <string>image.webPath;
  } else {
    console.error('Image element not found');
  }
};

export {
  CameraComponent
}