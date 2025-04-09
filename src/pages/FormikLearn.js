import styles from "./FormikLearn.module.css";
import NavHeader from "../components/NavHeader";
import { useFormik, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function MyField({field, form}) {
    console.log('MyField field: ', field);
    console.log('MyField form: ', form);
    return <input {...field}></input>
}

export default function FormikLearn() {
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        onSubmit: (values, {setSubmitting}) => {
            // formik 已经默认帮我们阻止了默认执行
            console.log('values: ', values);
            setSubmitting(true)
        },
        // validate: values => {
        //     const errors = {}
        //     if (!values.username) {
        //         errors.username = '请输入用户名'
        //     } else if (values.username.length < 6 || values.username.length > 16) {
        //         errors.username = '请输入6~16位的用户名'
        //     } else if (!/^\w{6,16}$/.test(values.username)) {
        //         errors.username = '请输入由字母、数字、下划线组成的用户名'
        //     }
        //     if (!values.password) {
        //         errors.password = '请输入密码'
        //     } else if (values.password.length < 6 || values.password.length > 16) {
        //         errors.password = '请输入6~16位的密码'
        //     } else if (!/^\w{6,16}$/.test(values.password)) {
        //         errors.password = '请输入由字母、数字、下划线组成的密码'
        //     }
        //     console.log('errors: ', errors);
        //     return errors
        // },
        validationSchema: Yup.object({
            username: Yup.string().required('请输入用户名')
                .min(6, '请输入6~16位的用户名')
                .max(16, '请输入6~16位的用户名')
                .matches(/^\w{6,16}$/, '请输入由字母、数字、下划线组成的用户名'), 
            password: Yup.string().required('请输入密码')
                .min(6, '请输入6~16位的密码')
                .max(16, '请输入6~16位的密码')
                .matches(/^\w{6,16}$/, '请输入由字母、数字、下划线组成的密码'),
        })
    })
    return (<div className={styles.root}>
        <NavHeader className={styles.header}>Formik</NavHeader>

        <form onSubmit={formik.handleSubmit}>
            <div>
                <label htmlFor="username">用户名：</label>
                <input id="username" type="text" name="username" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}></input>
                <p>{formik.touched.username && formik.errors.username ? formik.errors.username : ''}</p>
            </div>
            <div>
                <label htmlFor="password">密码：</label>
                <input id="password" type="password" name="password" value={formik.values.password} onChange={formik.handleChange}></input>
                <p>{formik.touched.password && formik.errors.password ? formik.errors.password : ''}</p>
            </div>
            <button type="submit" disabled={formik.isSubmitting}>提交</button>
        </form>

        <br />
        <Formik 
        initialValues={{username: '', password: ''}} // 设置初始化值
        onSubmit={(values, {setSubmitting}) => { // 提交表单执行的函数
            setTimeout(() => {
                console.log('values: ', values); 
                setSubmitting(true)
            }, 2000);
        }}
        validationSchema={Yup.object({ // 设置表单校验的模式
            username: Yup.string().required('请输入用户名')
                .min(6, '请输入6~16位的用户名')
                .max(16, '请输入6~16位的用户名')
                .matches(/^\w{6,16}$/, '请输入由字母、数字、下划线组成的用户名'), 
            password: Yup.string().required('请输入密码')
                .min(6, '请输入6~16位的密码')
                .max(16, '请输入6~16位的密码')
                .matches(/^\w{6,16}$/, '请输入由字母、数字、下划线组成的密码')
        })}>
            {({handleSubmit, values, touched, handleChange, handleBlur, errors, isSubmitting}) => {
                console.log('xx touched: ', touched);
                return <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username1">用户名：</label>
                        {/* <input id="username1" type="text" name="username" value={values.username} onChange={handleChange} onBlur={handleBlur}></input> */}
                        <Field id='username1' name='username' type='text'></Field>
                        {/* <p>{touched.username && errors.username ? errors.username : ''}</p> */}
                        <ErrorMessage name="username"></ErrorMessage>
                    </div>
                    <div>
                        <label htmlFor="password1">密码：</label>
                        <input id="password1" type="password" name="password" value={values.password} onChange={handleChange}></input>
                        <p>{touched.password && errors.password ? errors.password : ''}</p>
                    </div>
                    <button type="submit" disabled={isSubmitting}>提交</button>
                </form>
            }}
        </Formik>

        <br />
        <Formik 
        initialValues={{email: '', project: 2, phone: '', address: '1'}} // 设置初始化值
        onSubmit={(values) => { console.log('values: ', values); }} // 提交表单执行的函数
        validationSchema={Yup.object({ // 设置表单校验的模式
            phone: Yup.string().required('请输入电话号码')
                .matches(/^1[0-9]{10}/, '请输入有效的电话号码')
        })}>
            {({handleSubmit}) => {
                return <form onSubmit={handleSubmit}>
                    {/* 1、直接渲染 */}
                    <Field type='email' name='email' placeholder='请输入电子邮箱'></Field> <br/>

                    {/* 2、as 转化成其他节点 */}
                    <Field as='select' name='project'>
                        <option value={1}>数学及应用数学</option>
                        <option value={2}>软件工程</option>
                        <option value={3}>国际贸易</option>
                    </Field> <br/>

                    {/* 3、渲染 jsx */}
                    <Field name='phone'>
                        {({field, form, meta}) => {
                            console.log('field: ', field);
                            console.log('form: ', form);
                            console.log('meta: ', meta);
                            return <div>
                                <label htmlFor="phone">电话号码</label>
                                <input id="phone" type="text" placeholder="请输入电话号码" value={field.value.phone} {...field}></input>
                                <p>{ meta.touched && meta.error ? meta.error : ''}</p>
                            </div>
                        }}
                    </Field>

                    {/* 4、以 component 组件形式渲染 */}
                    <Field name='address' component={MyField}></Field> <br />
                    <button type="submit">提交</button>
                </form>
            }}
        </Formik>

        <br />
        <Formik
        initialValues={{social: {wechat: '', qq: ''}, friends: ['', '']}}
        onSubmit={(values, {setSubmitting}) => {
            console.log('values: ', values)
            setSubmitting(true)
        }} 
        validationSchema={Yup.object({
            social: Yup.object({
                wechat: Yup.string().required('请输入微信'), 
                qq: Yup.string().required('请输入QQ').matches(/^[\w]$/, '请输入有效的QQ')
            }),
            frends: Yup.array().of(Yup.string().required('请输入你的朋友'))
        })}>
            {({values, handleChange, handleBlur, touched, errors, isSubmitting, setValues, setFieldValue, handleSubmit}) => {
                console.log('object array values: ', values);
                console.log('object array handleChange: ', handleChange);
                console.log('object array handleBlur: ', handleBlur);
                console.log('object array touched: ', touched);
                console.log('object array errors: ', errors);
                console.log('object array setValues: ', setValues);
                console.log('object array setFieldValue: ', setFieldValue);
                return <form onSubmit={handleSubmit}>
                    <h4>社交账号</h4>
                    <label>微信：</label>
                    <input name="social.wechat" value={values.social.wechat} onChange={handleChange} onBlur={handleBlur}></input>
                    <p>{ touched.social && errors.social && touched.social.wechat && errors.social.wechat ? errors.social.wechat : ''}</p>
                    <br />
                    <label>QQ：</label>
                    <input name="social.qq" value={values.social.qq} onChange={handleChange} onBlur={handleBlur}></input>
                    <h4>朋友</h4>
                    {values.friends.map((v, i) => {
                        return (<div key={i}>
                            <input name={`friends[${i}]`} value={values.friends[i]} onChange={handleChange} onBlur={handleBlur}></input>
                            {i < values.friends.length && <br />}
                        </div>)
                    })}
                    <button type="submit" disabled={isSubmitting}>提交</button>
                </form>}}
        </Formik>
    </div>)
}