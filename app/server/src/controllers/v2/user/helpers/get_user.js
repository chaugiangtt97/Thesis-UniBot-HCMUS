export const get_user = (res) => {
  return {
    name: res?.name,
    email: res?.email,
    role: res?.educationRole,
    academicInformation: res?.academicInformation,
    generalInformation: res?.generalInformation,
    updatedAt: res?.updatedAt
  }
}