import { headerOptions, serverUrl } from "../context/StateProvider"
let token = JSON.parse(localStorage.getItem("token"))

export const chckUsrNm = async (uName) => {

    try {
        let res = await fetch(`${serverUrl}/user/profiles/check-username?uName=${uName.value}`,
            { headers: { "Authorization": `Bearer ${token}` }, method: "GET" })
        res = await res.json()
        return res;

    } catch (error) {
        return error
    }
}

export const updtUsrNm = async (uName) => {
    try {
        let res = await fetch(`${serverUrl}/user/profile/update-username`,
            {
                method: "PUT",
                headers: { ...headerOptions },
                body: JSON.stringify({ uName })
            })
        res = await res.json()
        return res;
    } catch (error) {
        return error
    }
}

export const updtPicAndFname = async (fData) => {
    try {
        let res = await fetch(`${serverUrl}/user/profile/update/name_pic`,
            {
                headers: { "Authorization": `Bearer ${token}` },
                method: "PUT", body: fData
            })
        res = await res.json()
        return res
    } catch (error) {
        return error
    }
}

export const chngPass = async (pass) => {
    try {
        let res = await fetch(`${serverUrl}/user/profile/change-password`, {
            method: "PUT", headers: { ...headerOptions }, body: JSON.stringify({ pass })
        })
        res = await res.json()
        return res
    } catch (error) {
        return error
    }
}

export const chngMblNm = async (mbl_num) => {
    try {
        let res = await fetch(`${serverUrl}/user/profile/change-mbl_nmbr`, {
            method: "PUT", headers: { ...headerOptions }, body: JSON.stringify({ mbl_num })
        })
        res = await res.json()
        return res
    } catch (error) {
        return error
    }
}