import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Slick from 'react-slick'
import {Overlay, Global, Header, CloseBtn, Indicator, Slickwrapper, ImagWrapper } from './styles'





const ImagesZoom = ({ images, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
   return(
       <Overlay>
           <Global />
           <Header>
               <h1>상세 이미지</h1>
               <CloseBtn onClick={onClose}>X</CloseBtn>
           </Header>
           <Slickwrapper>
               <div>
                   <Slick  
                   initialSlide={0}
                   afterChange={(slide) => setCurrentSlide(slide)}
                   infinite
                   arrows={false}
                   slidesToShow={1}
                   slidesToScroll={1}
                   >
                       {images.map((v)=> (
                           <ImagWrapper key={v.src}>
                            <img src={`http://localhost:3065/${v.src}`} alt={v.src} />
                           </ImagWrapper>
                       ))}
                   </Slick>
                   <Indicator>
                       <div>
                           {currentSlide +1}
                           {' '}
                           /
                           {images.length}
                       </div>
                   </Indicator>
               </div>
           </Slickwrapper>
       </Overlay>
   )
}

ImagesZoom.propTypes = {
    images:PropTypes.arrayOf(PropTypes.object).isRequired,
    onClose:PropTypes.func.isRequired,
};

export default ImagesZoom;