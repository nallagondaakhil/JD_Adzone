import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import  FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor';
//import FilerobotImageEditor from 'filerobot-image-editor';
import './MyReactComponent.scss';


export interface IMyComponentProps {
  sorce:{name:string,sorce:string};
  onClick?: () => void;
  savedCallBack?:(param:any)=>void;
}

export const MyReactComponent: FunctionComponent<IMyComponentProps> = (props: IMyComponentProps) => {

  const timerHandle = useRef<number | null>(null);
  //const [stateCounter, setStateCounter] = useState(42);
  const [isImgEditorShown, setIsImgEditorShown] = useState(false);
  const [cls, setCls] = useState("green");
  const openImgEditor = () => {
    setIsImgEditorShown(true);
  };

  const closeImgEditor = () => {
    onClick();
    setIsImgEditorShown(false);
  };



  const log=(editedImageObject, designState) => {

    const a = document.createElement('a')
    a.download =  editedImageObject.fullName;
    a.href = editedImageObject.imageBase64
    a.click()
  savedCallBack(editedImageObject)
    //console.log('saved', editedImageObject, designState);
  };
  // useEffect(() => {
  //   timerHandle.current = +setInterval(() => {
  //     setStateCounter(stateCounter + 1);
  //   }, 2500);

  //   return () => {
  //     if (timerHandle.current) {
  //       clearInterval(timerHandle.current);
  //       timerHandle.current = null;
  //     }
  //   };
  // });

  const {sorce: propsCounter, onClick,savedCallBack} = props;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (

  <div>
    <FilerobotImageEditor

source={props.sorce.sorce}
savingPixelRatio={ 20}
previewPixelRatio={20}

onSave={(editedImageObject, designState) => {

  // const a = document.createElement('a')
  // a.download =  editedImageObject.fullName;
  // a.href = editedImageObject.imageBase64
  // a.click()
  // console.log('saved', editedImageObject, designState);
}}
// saveOption={(x,y)=>{

// }}
onClose={closeImgEditor}
annotationsCommon={{
  fill: '#367C2B'
}}

moreSaveOptions={[
//   {
//   label: 'Save',
//   icon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.6358 1.52611L10.6367 1.52669C12.0996 2.48423 13.0845 3.97393 13.4308 5.67868C13.7768 7.38223 13.4302 9.13505 12.3952 10.5416L12.39 10.5495C11.4327 12.0121 9.94346 12.9968 8.23923 13.3433C7.8098 13.4238 7.35685 13.4767 6.93362 13.4767C3.87462 13.4767 1.16037 11.323 0.519402 8.23739L0.439941 7.68114V7.66612C0.439941 7.51027 0.483542 7.38547 0.56594 7.28247C0.641164 7.18844 0.75786 7.12545 0.882464 7.10167C1.03156 7.10432 1.15179 7.14773 1.25156 7.22754C1.34816 7.30483 1.41201 7.4259 1.43422 7.55435C1.60415 8.96178 2.28062 10.2289 3.35006 11.1576L3.35104 11.1584C5.69121 13.1603 9.21628 12.8792 11.1914 10.5379C13.1928 8.19761 12.9116 4.67271 10.5702 2.6978C9.44164 1.73866 8.00291 1.28774 6.53782 1.40044L6.53642 1.40056C5.21046 1.51341 3.97038 2.10561 3.04061 3.03539L2.70462 3.37138L3.76055 3.27979L3.7724 3.27705C4.02521 3.21871 4.29448 3.3949 4.35713 3.66641C4.41517 3.91791 4.24109 4.1857 3.97196 4.25015L1.82243 4.62652C1.69199 4.6481 1.55534 4.62267 1.46788 4.5527L1.45879 4.54543L1.4488 4.53944C1.35779 4.48483 1.27678 4.36595 1.25738 4.24958L0.819079 2.08516L0.818029 2.08061C0.759688 1.8278 0.935874 1.55854 1.20739 1.49588C1.45905 1.43781 1.72702 1.61214 1.79125 1.88157L1.96243 2.82299L2.19817 2.56396C4.3538 0.195428 7.94737 -0.257315 10.6358 1.52611Z" fill="#5D6D7E"/><path d="M7.49822 3.76409V7.16923L9.24296 8.91397C9.32292 8.99394 9.38351 9.11495 9.38351 9.25603C9.38351 9.37909 9.3437 9.49734 9.24296 9.59809C9.16576 9.67528 9.0184 9.73864 8.9009 9.73864C8.77784 9.73864 8.65958 9.69883 8.55884 9.59809L6.67355 7.7128C6.59636 7.6356 6.533 7.48823 6.533 7.37074V3.76409C6.533 3.50452 6.75603 3.28148 7.0156 3.28148C7.3025 3.28148 7.49822 3.4772 7.49822 3.76409Z" fill="#5D6D7E"/></svg>',
//   onClick: (openSaveModal, _saveDirectly) =>{
//     openSaveModal(console.log)

//   }
// },
{
  label: 'download',
  icon: '<svg focusable="false" aria-hidden="true" fill="#666666" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>',
  onClick: async (_openSaveModal, saveDirectly) => {
 saveDirectly( log   );
    console.log("down")
    },
},]}
Text={{ text: 'Text...' ,
fonts: [ 'JDSansPro-Medium','JDSansPro-Bold','Noto Sans'], // must be loaded in the website or the user have them on his system
  fontFamily: 'JDSansPro-Medium',
onFontChange: (newFontFamily, reRenderCanvasFn) => {
 // reRenderCanvasFn();
  // if (newFontFamily.toLowerCase() === 'myFirstFont') {
  //   //  Load sans-serif font.
  //   reRenderCanvasFn();
  // }
}
}}
translations={  {

    'toolbar.save': 'Download',
    'toolbar.apply': 'Apply',
  profile: 'Profile',
  coverPhoto: 'Cover photo',
  facebook: 'Facebook',
  socialMedia: 'Social Media',
  fbProfileSize: '180x180px',
  fbCoverPhotoSize: '820x312px',
}}
// Crop={

//   {
//     ratio:'original',
//     ratioTitleKey:'original',
//     minWidth:50,

//   presetsItems: [
//     {

//       titleKey: 'classicTv',
//       descriptionKey: '4:3',
//       ratio: '21 / 9',
//       // icon: CropClassicTv, // optional, CropClassicTv is a React Function component. Possible (React Function component, string or HTML Element)
//     },
//     {
//       titleKey: 'cinemascope',
//       descriptionKey: '21:9',
//       ratio:' 21 / 9',
//       // icon: CropCinemaScope, // optional, CropCinemaScope is a React Function component.  Possible (React Function component, string or HTML Element)
//     },
//   ],
//   presetsFolders: [
//     {
//       titleKey: 'socialMedia', // will be translated into Social Media as backend contains this translation key
//       // icon: Social, // optional, Social is a React Function component. Possible (React Function component, string or HTML Element)
//       groups: [
//         {
//           titleKey: 'facebook',
//           items: [
//             {
//               titleKey: 'profile',
//               width: 1800,
//               height: 1800,
//               descriptionKey: 'fbProfileSize',
//             },
//             {
//               titleKey: 'coverPhoto',
//               width: 8200,
//               height: 312,
//               descriptionKey: 'fbCoverPhotoSize',
//             },
//           ],
//         },
//       ],
//     },
//   ],
// }}
 tabsIds={[ TABS.ANNOTATE]} // or {['Adjust', 'Annotate', 'Watermark']}
defaultTabId={TABS.ANNOTATE} // or 'Annotate'
defaultToolId={TOOLS.TEXT} // or 'Text'
disableZooming={true}

useZoomPresetsMenu={true}

    />

</div>
  );
};
