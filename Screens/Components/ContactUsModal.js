import React,{useState} from 'react'
import { Modal,View,Text,TextInput, Pressable, Button, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Url } from '../../Url'

 const  ContactUsModal=({visible,setVisible})=> {
    const { t } = useTranslation()
    const [name,setName]=useState("")
    const [email, setEmail]=useState("")
    const [message, setMessage]=useState("")
    const [sending,setSending]=useState(false)
    const handleSubmit=async()=>{
        console.log("Sending Email")
        if(name && email && message){
            //Send email
            setSending(true);
            const myHeader=new Headers({'Content-Type': 'application/json'});
            const body=JSON.stringify({"subject":name,"email":email,"message":message})
            const requestOptions={
                method:"POST",
                headers:myHeader,
                body:body,
                redirect:"follow"
            }
            const response=await fetch(`${Url}/notification/send_email`, requestOptions)
            console.log(await response.json())
            if(!response.ok) {
                setSending(false)
                console.log("error",await response.data())
                return
            }
            setEmail("")
            setName("")
            setMessage("")
            setSending(false)
            setVisible(false)
            // const data=await response.json()
            // console.log("data sent sucess",data)
            
            // console.log(data)
            
        }else{
            alert("Please fill all fields")
        }
    }
  return (
    <Modal animationType='slide' transparent visible={visible} onRequestClose={()=>setVisible(false)}>
        <View style={{backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%'}}>
            <View className="flex flex-row items-center justify-between">
            <Text className="font-bold text-lg my-2">{t("contact_us")}</Text>
            <TouchableOpacity onPress={()=>setVisible(false)} className="bg-red-700 rounded-md  py-2 px-4">
                <Text className="text-white font-bold text-sm">{t("cancel")}</Text>
            </TouchableOpacity>
            </View>
            <View className="flex flex-col gap-y-2 my-2">
                <Text className="font-bold">{t("Names")}</Text>
                <TextInput placeholder={t('name')} value={name} onChangeText={(e)=>setName(e)} className="w-[90%]  rounded-full py-2 px-2 border border-gray-600"/>
            </View>
            <View className="flex flex-col gap-y-2">
                <Text className="font-bold">{t("Email/ Phone Number")}</Text>
                <TextInput placeholder={t('email/phone number')} value={email} onChangeText={(e)=>setEmail(e)} className="w-[90%]  rounded-full py-2 px-2 border border-gray-600"/>
            </View>
            <View className="flex flex-col gap-y-2 my-2">
                <Text className="font-bold">{t("Message")}</Text>
                <TextInput multiline placeholder={t('message')} value={message} onChangeText={(e)=>setMessage(e)} className="w-[90%] h-20 rounded-md max-h-24 py-2 px-2 border border-gray-600"/>
            </View>
            {sending && <Text className="text-green-900 font-bold text-lg"> Sending ...</Text>}
            <TouchableOpacity onPress={()=>handleSubmit()} className="flex bg-blue-800 py-2 w-[90%] items-center justify-center rounded-full">
                <Text className="font-bold text-md text-white font-bold py-2 px-4 rounded-full ">
                    {t("Send")}
                </Text>
            </TouchableOpacity>
          </View>
        </View>
  
    </Modal>
  )
}
export default ContactUsModal
