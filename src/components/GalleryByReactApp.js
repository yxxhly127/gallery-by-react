
import React from 'react';
import ReactDOM from 'react-dom';


//css
// require("normalize.css");
require('../styles/main.scss');

var imageDatas = require('json!../data/imagesDatas.json');
imageDatas = (function genImageUrl(imageDatasArr){
  for(var i = 0 , j = imageDatasArr.length;i < j; i++){
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

/*
  获取0-30之间的一个任意正负值
*/
function get30DegRandom(){
  return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}

var ImgFigure = React.createClass({
  handleClick: function(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  ,
  render: function(){

    var styleObj = {};
    // 如果props属性中制定了这种图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    //如果图片的选装角度幼稚并且不为0，添加选装角度
    if(this.props.arrange.rotate){
      (['-moz-','-ms-','-webkit-',' ']).forEach(function(value){
          styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }

    var imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className = {imgFigureClassName} style = {styleObj} onClick = {this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.imageURL}/>
        <figcaption>
          <h2 className = "img-title">{this.props.data.title}</h2>
          <div className = "img-back" onClick = {this.handleClick}>
              <p>
                {this.props.data.desc}
              </p>
          </div>
        </figcaption>
      </figure>
    )
  }
});

/*
  获取区间内的一个随机值
*/
function getRangeRandom(low,high){
    return Math.ceil((Math.random() * (high - low) + low));
}
//控制组件
var ControllerUnit = React.createClass({
    handleClick:function(e){
        //如果点击的是当前正在选中状态状态图片，则翻转图片，否则将对应的图片居中显示
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.preventDefault();
        e.stopPropagation();
    },
    render: function(){
      var controllerUnitClassName = "controller-unit";

      // 如果对应的居中图片，显示控制按钮的居中状态
      if(this.props.arrange.isCenter){
        controllerUnitClassName += " is-center";

        //如果同时对应的是翻转图片, 显示控制按钮的翻转状态
        if(this.props.arrange.isInverse){
          controllerUnitClassName += " is-inverse";
        }
      }
      return (
        <span className = {controllerUnitClassName} onClick = {this.handleClick}></span>
      );
    }
});

var GalleryByReactApp = React.createClass({
  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {  // 水平反向取值范围
      leftSecX: [0,0],
      rightSecX: [0,0],
      y:[0,0]
    },
    vPosRange: { // 垂直方向的取值范围
      x: [0,0],
      topY: [0,0]
    }
  },
  /*
    翻转图片
    @param index, 输入当前被执行inverse操作的图片信息组的index值
    @return {Function} 这是一个闭包函数，其内return一个真正被执行的函数
  */
  inverse:function(index){
    return function(){
      debugger;
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }.bind(this);
  },
  //重新布局图片
  rearrange: function(centerIndex){
      var imgsArrangeArr = this.state.imgsArrangeArr,
          Constant = this.Constant,
          centerPos = Constant.centerPos,
          hPosRange = Constant.hPosRange,
          vPosRange = Constant.vPosRange,
          hPosRangeLeftSecX = hPosRange.leftSecX,
          hPosRangeRightSecX = hPosRange.rightSecX,
          hPosRangeY = hPosRange.y,
          vPosRangeTopY = vPosRange.topY,
          vPosRangeX = vPosRange.x,

          imgsArrangeTopArr  = [],
          topImgNum = Math.floor(Math.random() * 2),//取零个或一个

          topImgSpliceIndex = 0 ,
          imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

          // 居中图片，居中的图片不要选装
          imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isInverse : false,
            isCenter: true
          }

          // 取出要布局上册的图片状态信息
          topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
          imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
          //布局位于上册的图片
          imgsArrangeTopArr.forEach(function(value,index){
            imgsArrangeTopArr[index] =  {
                pos:{
                  top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                  left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
                },
                rotate: get30DegRandom(),
                isInverse : false,
                isCenter: false
              };
          });

          //布局左右两侧的图片
          for(var i = 0 , j = imgsArrangeArr.length, k = j /2 ; i < j ; i++){
            var hPosRangeLORX = null;
            // 前半部分布局左边，后半部分布局右边
            if(i < k){
              hPosRangeLORX = hPosRangeLeftSecX;
            } else {
              hPosRangeLORX = hPosRangeRightSecX;
            }
            imgsArrangeArr[i] =  {
              pos : {
                top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
              },
              rotate: get30DegRandom(),
              isInverse : false,
              isCenter: false
            }
          }

          //重新组合数组
          if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
            imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
          }

          imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
          this.setState({
            imgsArrangeArr: imgsArrangeArr
          });

  },
  /*
    利用rearrange函数，居中对应index的图片
    @param index, 需要被居中的图片对应的图片信息数组的index值
    @return {Function}
  */
  center: function(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  },
  getInitialState: function(){
    return {
      imgsArrangeArr: [
        {
          // pos: {
          //   left: '0',
          //   top : '0'
          // },
          // rotate: '0',
          // isInverse : false //是否是正反面
          // isCenter: false // 图片是否居中
        }
      ]
    }
  },
  //组件加载后，为每张图片计算其位置的范围
  componentDidMount: function(){
    // 拿到舞台的大小
    var stageDom = ReactDOM.findDOMNode(this.refs.stage),
        stageW =  stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = stageW/2,
        halfStageH = stageH/2;

    // 拿到一个imageFigure的大小
    var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = imgW/2,
        halfImgH = imgH/2;

    // 计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH,
    }

   //计算左侧，右侧区域图片排布位置的取值范围
   this.Constant.hPosRange.leftSecX[0] = -halfImgW;
   this.Constant.hPosRange.leftSecX[1] = halfStageW - 3*halfImgW;
   this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
   this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
   this.Constant.hPosRange.y[0] = -halfImgH;
   this.Constant.hPosRange.y[1] = stageH - halfImgH;

   this.Constant.vPosRange.topY[0] = -halfImgH;
   this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
   this.Constant.vPosRange.x[0] = halfStageW - imgW;
   this.Constant.vPosRange.x[1] = halfStageW;

   this.rearrange(0);
  },
  render:function(){
    var controllerUnits = [],
        imgFigures = [];
        debugger;
    imageDatas.forEach(function(value,index){
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse : false, //是否是正反面 false 正面 true 反面,
          isCenter: false // 是否居中
        }
      }
      imgFigures.push(<ImgFigure data = {value} ref ={'imgFigure' + index} arrange = {this.state.imgsArrangeArr[index]} inverse = {this.inverse(index)} center = {this.center(index)}/>);
      controllerUnits.push(<ControllerUnit arrange = {this.state.imgsArrangeArr[index]} inverse = {this.inverse(index)} center = {this.center(index)}/>)
    }.bind(this));
    return (
      <section className = "stage" ref = "stage">
          <section className = "img-sec">
            {imgFigures}
          </section>
          <nav className = "controller-nav">
            {controllerUnits}
          </nav>
      </section>
    );
  }
});
module.exports = GalleryByReactApp;
