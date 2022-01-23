import React from "react"
import bananIcnNoPd from "../../../assets/image/bananIcnNoPd.svg"
import loadingIcon from "../../../assets/image/loadingIcon.svg"

import "./Preloader.scss"

const Preloader = ({ classes = "", circleWidth = "70px" }) => {
    return (
        <div class={`preloader ${classes}`}>
            <div class="preloader__wall">
                <div className="preloader__loading-place">
                    <img
                        style={{ width: `${circleWidth}` }}
                        src={loadingIcon}
                        alt="loadingIcon"
                    />
                </div>
            </div>
        </div>
    )
}
// const Preloader = ({ classes = "" }) => {
//     return (
//         <div class={`preloader ${classes}`}>
//             <div class="preloader__wall">
//                 <div class="preloader__banan first-banan">
//                     <img src={bananIcnNoPd} alt="bananIcnNoPd" />
//                 </div>
//                 <div class="preloader__banan second-banan">
//                     <img src={bananIcnNoPd} alt="bananIcnNoPd" />
//                 </div>
//                 <div class="preloader__banan third-banan">
//                     <img src={bananIcnNoPd} alt="bananIcnNoPd" />
//                 </div>
//             </div>
//         </div>
//     );
// };

export default Preloader
