import {Preferences} from '@capacitor/preferences';

async function setObject(key: string, object: object) {
  await Preferences.set({
    key: key,
    value: JSON.stringify(object)
  });
}

// JSON "get" example
const getObject = async (keyValue: string) => {
  const ret = await Preferences.get({key: keyValue});

  if (ret.value != null) {
    return JSON.parse(ret.value);
  }

  return {}
}

export {
  setObject,
  getObject
}