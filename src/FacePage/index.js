import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {connect } from "react-redux";
import mapStateToProps from './mapStateToProps';
import mapDispatchToProps from './mapDispatchToProps';
import Camera from './Camera'; 
import Canva from './Canva'; 
import * as faceapi from 'face-api.js';

class FacePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            controller:'game',
            loading: false,
            authorized:false,
            checkAutorization:true,
            positionIndex:0,
        }
        this.setVideoHandler = this.setVideoHandler.bind(this);
        this.isModelLoaded =  this.isModelLoaded.bind(this);
    }
    
    async setVideoHandler(){
        if (this.isModelLoaded()!==undefined){
            try{
                // let result= await faceapi.detectSingleFace(this.props.video.current, this.props.detector_options).withFaceLandmarks();
                // #############  
                //let result= await faceapi.detectSingleFace(this.props.video.current, this.props.detector_options).withFaceLandmarks().withFaceExpressions();
                let result= await faceapi.detectSingleFace(this.props.video.current, this.props.detector_options)
                .withFaceLandmarks()
                .withFaceExpressions()
                .withAgeAndGender();

                if (result!==undefined){
                    //console.log("face detected",result);
                    const dims = faceapi.matchDimensions(this.props.canvas.current, this.props.video.current, true);
                    const resizedResult = faceapi.resizeResults(result, dims);
                    //faceapi.draw.drawDetections(this.props.canvas.current, resizedResult);
                    //faceapi.draw.drawFaceLandmarks(this.props.canvas.current, resizedResult);
                   // ################ 
                   // ################ 
                   const minProbability = 0.05  
                   faceapi.draw.drawFaceExpressions(this.props.canvas.current, resizedResult, minProbability);
                   // ################ 
                   const { age, gender, genderProbability } = result

                    new faceapi.draw.DrawTextField(
                        [
                          `${faceapi.utils.round(age, 0)} years`,
                          `${gender} (${faceapi.utils.round(genderProbability)})`
                        ],
                        //result.detection.box.bottomLeft
                        result.detection.box.bottomRight
                      ).draw(this.props.canvas.current)
                      // ################ 
                      // ################ 
                      /*
                      let base_image = new Image();
                    base_image.src = 'https://i.ya-webdesign.com/images/lentes-de-sol-png-3.png';
                    base_image.onload = function(){
                        canvasElement.drawImage(base_image, result.landmarks.positions[36].x-15, 
                                result.landmarks.positions[36].y-25,130,50);
                    }*/
                    let base_image_lentes = new Image();
                    base_image_lentes.src = 'https://cdn.pixabay.com/photo/2014/04/02/10/16/sunglasses-303327_960_720.png';
                    base_image_lentes.onload = function(){
                        canvasElement.drawImage(base_image_lentes, result.landmarks.positions[36].x-25, 
                                result.landmarks.positions[36].y-23,140,60);
                    }

                    let base_image_virus_izquierda = new Image();
                    base_image_virus_izquierda.src = 'https://www.pcc.edu/online/wp-content/uploads/sites/78/2015/07/germ-158107_640.png';
                    base_image_virus_izquierda.onload = function(){
                        canvasElement.drawImage(base_image_virus_izquierda, result.landmarks.positions[1].x-100, 
                                result.landmarks.positions[1].y-25,64,49);
                    }

                    let base_image_virus_derecha = new Image();
                    base_image_virus_derecha.src = 'https://www.pcc.edu/online/wp-content/uploads/sites/78/2015/07/germ-158107_640.png';
                    base_image_virus_derecha.onload = function(){
                        canvasElement.drawImage(base_image_virus_derecha, result.landmarks.positions[15].x+30, 
                                result.landmarks.positions[15].y-25,64,49);
                    }

                    let base_image_mascarilla = new Image();
                    base_image_mascarilla.src = 'https://www.abrasivosandra.com/sitio/images/2730_sin_fondo_.png';
                    base_image_mascarilla.onload = function(){
                        canvasElement.drawImage(base_image_mascarilla, result.landmarks.positions[1].x+1, 
                                result.landmarks.positions[1].y-25,150,150);
                    }

                    //ADD CANVAS
                    const currentCanvas = ReactDOM.findDOMNode(this.props.canvas.current);
                    
                    var canvasElement = currentCanvas.getContext("2d");
                    //console.log("#######",canvasElement);
                    
                    //ctx.lineTo(x,y);
                    //ctx.stroke();
                    canvasElement.fillStyle = 'rgb(255, 87, 51)';
                    //ctx.fillRect(result.alignedRect.box.x, result.alignedRect.box.y, 100, 50);
                    // jaw 0-16  left eyebrow  17-21 right eyebrow  22-26  nose 27-35  left eye 36-41  right eye 42-47 and mouth 48-67
                     
                    //const leftEyeBbrow = landmarks.getLeftEyeBrow();

                   /* canvasElement.fillRect(result.landmarks.positions[this.state.positionIndex].x,
                                 result.landmarks.positions[this.state.positionIndex].y, 
                                 10, 10);
                    canvasElement.closePath(); */

                    canvasElement.font="20px Comic Sans MS";
                    canvasElement.fillStyle = "red";
                    let positionX=result.landmarks.positions[27].x,
                        positionY=result.landmarks.positions[27].y-70;
                    //canvasElement.strokeText( (result.gender)==="male" ? "Hombre" :"Mujer", 
                    canvasElement.fillText( (result.gender)==="male" ? "Hombre" :"Mujer", 
                        positionX,positionY );

                    //canvasElement.im
                }
            }catch(exception){
                console.log(exception);
            }
        }
        setTimeout(() => this.setVideoHandler());
    }

    isModelLoaded(){
        if (this.props.selected_face_detector === this.props.SSD_MOBILENETV1){
            return faceapi.nets.ssdMobilenetv1.params;
        } 
        if (this.props.selected_face_detector === this.props.TINY_FACE_DETECTOR) {
            return faceapi.nets.tinyFaceDetector.params;
        }
    }

    
    async componentDidMount() {
        console.log("height: "+window.screen.height+", width: "+window.screen.width);
        
        this.setDetectorOptions();
        this.props.SET_VIDEO_HANDLER_IN_GAME_FACENET(this.setVideoHandler);
        
        let modelFolder="/models";
        try{
            await faceapi.loadFaceLandmarkModel(modelFolder);
            
            //await faceapi.nets.ageGenderNet.loadFromUri(modelFolder);
            
            await faceapi.loadAgeGenderModel(modelFolder);
            await faceapi.loadFaceExpressionModel(modelFolder);

            if (this.props.selected_face_detector === this.props.SSD_MOBILENETV1){
                await faceapi.nets.ssdMobilenetv1.loadFromUri(modelFolder);
            }
                
            if (this.props.selected_face_detector === this.props.TINY_FACE_DETECTOR) {
                await faceapi.nets.tinyFaceDetector.load(modelFolder);
            }
        }catch(exception){
            console.log("exception",exception);
        }        
    }

    setDetectorOptions() {
        let minConfidence = this.props.min_confidence,
            inputSize= this.props.input_size,
            scoreThreshold= this.props.score_threshold;

        let options= this.props.selected_face_detector === this.props.SSD_MOBILENETV1
          ? new faceapi.SsdMobilenetv1Options({ minConfidence })
          : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
        this.props.SET_DETECTOR_OPTIONS_IN_GAME_FACENET(options);
    }
 
    render() {
        return (
            <div>
                <Camera/>
                <Canva/>
               
                <input type="number" 
                    style={{marginLeft:1000}} 
                    value={this.state.positionIndex} 
                    onChange={(event)=>{this.setState({positionIndex: event.target.value})}}/>   
                          
            </div>            
        )
    }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(FacePage);