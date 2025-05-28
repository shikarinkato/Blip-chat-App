const reader = new FileReader()
export const readFile = async (file) => {

    return new Promise((rslv, rjct) => {
        reader.onload = () => {
            rslv(reader.result)
        }

        reader.onerror = (err) => {
            rjct(err)
        }
        reader.readAsDataURL(file)
    })
}