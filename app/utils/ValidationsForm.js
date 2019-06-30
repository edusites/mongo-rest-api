
class ValidationsForm{
  
  static validaString(string){
    const pattern = /^[a-zà-ú\s]+$/i
    const validate = pattern.test(string)
    if(!validate){
      return false
    }
    return true
  }

  static validaEmail(email){
    const pattern = /\S+@\S+\.\S+/i
    const validate = pattern.test(email)
    if(!validate){
      return false
    }
    return true
  }

  static validaTel(tel){
    const pattern = /^(\(0?\d{2}\)\s?|0?\d{2}[\s.-]?)\d{4,5}[\s.-]?\d{4}$/
    const validate = pattern.test(tel)
    if(!validate){
      return false
    }
    return true
  }
  

}


module.exports = ValidationsForm