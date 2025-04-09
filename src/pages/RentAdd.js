import { useLocation, useNavigate } from "react-router-dom";
import styles from "./RentAdd.module.css";
import NavHeader from "../components/NavHeader";
import { ImageUploader, Input, List, Modal, Picker, TextArea, Toast } from "antd-mobile";
import { useState } from "react";
import { instance } from "../utils/api";
import { baseUrl } from "../utils/constValue";
import HousePackage from "../components/HousePackage";

// 房屋类型
const roomTypeData = [
    { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
    { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
    { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
    { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
    { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
    { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
    { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
    { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
    { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
    { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
    { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
    { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
    { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
    { label: '高楼层', value: 'FLOOR|1' },
    { label: '中楼层', value: 'FLOOR|2' },
    { label: '低楼层', value: 'FLOOR|3' }
]

// 获取数据列表中 value 对应的 label 值
const labelForValue = (data, value) => {
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.value === value) {
            return element.label
        }
    }
    return null
}

export default function RentAdd() {
    const {state} = useLocation()
    const navigate = useNavigate()
    const [info, setInfo] = useState({community: state ? state.community : {}})
    return <div className={styles.root}>
        <NavHeader className={styles.navHeader}>发布房源</NavHeader>
        <div className={styles.content}>
            <List className={styles.header} header='房源信息'>
                <List.Item prefix={<label>小区名称</label>} extra={info.community.communityName || '请选择'} clickable onClick={() => navigate('/rent/search')}></List.Item>
                <List.Item prefix={<label htmlFor='price'>租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金</label>} extra='￥/月'>
                    <Input id="price" placeholder="请输入租金/月" value={info.price} onChange={(v) => {
                        const newInfo = {...info}
                        newInfo.price = v
                        setInfo(newInfo)
                    }}></Input>
                </List.Item>
                <List.Item prefix={<label htmlFor='size'>建筑面积</label>} extra='m²'>
                    <Input id="size" placeholder="请输入建筑面积" value={info.size} onChange={(v) => {
                        const newInfo = {...info}
                        newInfo.size = v
                        setInfo(newInfo)
                    }}></Input>
                </List.Item>
                <Picker columns={[roomTypeData]} value={[info.roomType]} onConfirm={(v) => {
                    console.log('room type value: ', v)
                    const newInfo = {...info}
                    newInfo.roomType = v[0]
                    setInfo(newInfo)
                }}>
                    {(_, actions) => {
                        return <List.Item prefix={<label>户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型</label>} extra={labelForValue(roomTypeData, info.roomType) || '请选择'} clickable onClick={actions.open}></List.Item>
                    }}
                </Picker>
                <Picker columns={[floorData]} value={[info.floor]} onConfirm={(v) => {
                    console.log('floor value: ', v)
                    const newInfo = {...info}
                    newInfo.floor = v[0]
                    setInfo(newInfo)
                }}>
                    {(_, actions) => {
                        return <List.Item prefix={<label>所在楼层</label>} extra={labelForValue(floorData, info.floor) || '请选择'} clickable onClick={actions.open}></List.Item>
                    }}
                </Picker>
                <Picker columns={[orientedData]} value={[info.oriented]} onConfirm={(v) => {
                    console.log('oriented value: ', v)
                    const newInfo = {...info}
                    newInfo.oriented = v[0]
                    setInfo(newInfo)
                }}>
                    {(_, actions) => {
                        return <List.Item prefix={<label>朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向</label>} extra={labelForValue(orientedData, info.oriented) || '请选择'} clickable onClick={actions.open}></List.Item>
                    }}
                </Picker>
            </List>
            <List header='房屋标题'>
                <List.Item>
                    <Input placeholder="请输入标题（例如：整租 小区名 2室 5000元）" value={info.title} onChange={(v) => {
                        const newInfo = {...info}
                        newInfo.title = v
                        setInfo(newInfo)
                    }}></Input>
                </List.Item>
            </List>
            <List header='房屋图像'>
                <List.Item>
                    <ImageUploader value={info.houseImg} multiple maxCount={9} 
                    showUpload={info.houseImg ? info.houseImg.length < 9 : true} 
                    onCountExceed={(exceed) => Toast.show(`最多选择 9 张图片，您多选了 ${exceed} 张`)} 
                    onChange={(v) => {
                        console.log('temp slides value: ', v);
                        const newInfo = {...info}
                        newInfo.houseImg = v
                        console.log('new info: ', newInfo);
                        setInfo(newInfo)
                    }} upload={async (file) => {
                        console.log('file: ', file);
                        const fd = new FormData()
                        fd.append('file', file)
                        const data = await instance.post('/houses/image', fd, {headers: {'Content-Type': 'multipart/form-data'}})
                        console.log('image data: ', data);
                        if (data.status === 200) {
                            const url = data.body[0]
                            return {url: baseUrl + data.body[0]}
                        }
                    }}></ImageUploader>
                </List.Item>
            </List>
            <List header='房屋配置'>
                <List.Item>
                    <HousePackage onSelect={(names) => {
                        const newInfo = {...info}
                        newInfo.supporting = names.join('|')
                        setInfo(newInfo)
                    }}></HousePackage>
                </List.Item>
            </List>
            <List header='房屋描述'>
                <List.Item>
                    <TextArea placeholder="请输入房屋描述信息" value={info.description} rows={5} onChange={(v) => {
                        const newInfo = {...info}
                        newInfo.description = v
                        setInfo(newInfo)
                    }}></TextArea>
                </List.Item>
            </List>
            <div className={styles.bottom}>
                <div className={styles.cancel} onClick={() => {
                    Modal.show({
                        title: '提示',
                        content: '放弃发布房源?',
                        closeOnAction: true,
                        actions: [
                            {
                                key: 'cancel',
                                text: '放弃',
                                onClick: () => {
                                    navigate(-1)
                                }
                            },
                            {
                                key: 'edit',
                                text: '继续编辑',
                                primary: true
                            }
                        ]
                    })
                }}>取消</div>
                <div className={styles.confirm} onClick={() => {
                    console.log('confirm info: ', info);
                    const params = {...info}
                    if (info.community) {
                        params.community = info.community.community
                    }
                    if (info.houseImg) {
                        const imgs = info.houseImg.map((v) => v.url.replace(baseUrl, ''))
                        params.houseImg = imgs.join('|')
                    }
                    console.log('confirm params: ', params);
                    instance.post('/user/houses', params).then((data) => {
                        console.log('add houses data: ', data);
                        if (data.status === 200) {
                            navigate('/rent')
                        } else {
                            Toast.show('服务开小差，请稍后再试！')
                        }
                    })
                }}>提交</div>
            </div>
        </div>
    </div>
}