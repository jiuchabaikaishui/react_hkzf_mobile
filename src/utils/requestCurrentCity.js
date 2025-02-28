import { instance } from "./api";

export default function requestCurrentCity() {
    // 获取本地存储中是否有
    const localCity = localStorage.getItem('localCity')
    console.log('localCity', localCity);
    if (localCity) {
        // 如果有，返回城市信息就好,返回一个成功的promis对象即可
        return Promise.resolve(JSON.parse(localCity))
    } else {
        return new Promise((resolve, reject) => {
            var localCity = new window.BMapGL.LocalCity();
            localCity.get(async (result) => {
                console.log('LocalCity：', result);
                try {
                    const city = await instance.get('area/info?name=' + result.name)
                    console.log('city: ', city);
                    
                    if (city.status === 200) {
                        localStorage.setItem('localCity', JSON.stringify(city.body))
                        resolve(city.body)
                    } else {
                        console.error(city.description);
                        throw new Error(city.description);
                    }
                } catch (error) {
                    reject(error)
                }
            }); 
        })
    }
}