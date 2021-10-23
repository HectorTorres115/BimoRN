export const HandleError = (error) => {
    console.log(error)
    throw new Error(error)
}