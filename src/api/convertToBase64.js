export default function convertToBase64(e){
    console.log(e)
    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
        console.log()
        setImage(reader.result)
    }
    reader.onerror = error => {
        console.error("Ошибка загрузки: ", error)
    }
}