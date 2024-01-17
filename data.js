const enums = {

  bannerType: ['S', 'L'], // S = SCREEN, l = lINK, CR = CONTEST REDIRECT
  bannerScreen: ['D', 'S', 'CR'], // D = DEPOSIT S = SHARE
  bannerPlace: ['D', 'H'], // D = DEPOSIT H = HOME

  popupAdsType: ['I', 'E'], // I = INTERNAL, E = EXTERNAL
  popupAdsPlatform: ['ALL', 'W', 'A', 'I'], // I = IOS, A = ANDROID, W = WEB

  status: ['Y', 'N'],
  cssTypes: ['COMMON', 'CONDITION'],
  versionType: ['A', 'I'], // A = Android, I = iOS
  imageFormat: [{ extension: 'jpeg', type: 'image/jpeg' }, { extension: 'jpg', type: 'image/jpeg' }, { extension: 'png', type: 'image/png' }, { extension: 'gif', type: 'image/gif' }, { extension: 'svg', type: 'image/svg+xml' }, { extension: 'heic', type: 'image/heic' }, { extension: 'heif', type: 'image/heif' }],
  eAAALogEndpoints: [], // To log user's particular endpoints
  adminType: ['SUPER', 'SUB'],
  adminPermissionType: ['R', 'W', 'N'], // Read (R), Write (W), None (N) - Access Rights
  adminPermission: ['FILE'],
  moduleName: ['FILE-SHARING'],
}

module.exports = enums
