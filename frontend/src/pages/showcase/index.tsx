import React from 'react'
import Layout from '../../components/Layout'
import AuthenticatedNav from '../../components/AuthenticatedNav'
import Carousel from './Carousel'

const index = () => {
  return (
    <Layout overflowHidden={true}>
        <AuthenticatedNav />

       <div className="w-full h-screen">  <Carousel /></div>
    </Layout>
  )
}

export default index