// QnA features component like,unlike

import React, { useState, useEffect } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CloseIcon from "@mui/icons-material/Close";
import axios from 'axios';
import Snackbar from "@mui/material/Snackbar";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, clearMessages } from "../../Redux/Store/Store";
import { api } from "../../../config";
import { addTrackingData } from "../../Redux/Store/Store";
import "../layout/layout.css";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";


const LikeButton = ({ content }) => {
  const {t}=useTranslation();
  const [isLikeClicked, setIsLikeClicked] = useState(false);
  const [isDislikeClicked, setIsDislikeClicked] = useState(false);
  const [openLikeDialog, setOpenLikeDialog] = useState(false);
  const [openDislikeDialog, setOpenDislikeDialog] = useState(false);
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const dispatch = useDispatch();

  const conversation = useSelector((state) => state.conversation);
  const AccountInfo = useSelector((state) => state.accountInfo);
  const { userName } = AccountInfo.account;



  const handleCloseSnackbar = () => setOpenSnackbar(false);
  const handleClick = () => setOpenSnackbar(true);

  const handleLike = () => {
    if(isLikeClicked === false){
    setIsLikeClicked(true);
    setIsDislikeClicked(false); // Ensure only one option is selected at a time
    setOpenLikeDialog(true);
    const eventData = { event: 'buttonClick', status: 'handleLike button click  successfull' };
    // Dispatch action to add tracking data to Redux store
    dispatch(addTrackingData(eventData));
    }else{
      setIsLikeClicked(false);
    }
  };
  
  const handleDislike = () => {
    if(isDislikeClicked === false){
    setIsLikeClicked(false); // Ensure only one option is selected at a time
    setIsDislikeClicked(true);
    setOpenDislikeDialog(true);
    const eventData = { event: 'buttonClick', status: 'handleDislike button click  successfull' };
    // Dispatch action to add tracking data to Redux store
    dispatch(addTrackingData(eventData));
    }else{
      setIsDislikeClicked(false);
    }
  };
  
  const handleDialogClose = () => {
    setOpenLikeDialog(false);
    setOpenDislikeDialog(false);
    setIsLikeClicked(!isDislikeClicked);
    setIsDislikeClicked(!isLikeClicked);
    setSelectedButtons([]);
    setAdditionalFeedback('');

  };
// Replace the handleButtonSelect function with this one
const handleButtonSelect = (button) => {
  // Check if the button is already selected
  if (selectedButtons.includes(button)) {
    // If selected, remove it from the selected buttons
    setSelectedButtons(selectedButtons.filter((btn) => btn !== button));
  } else {
    // If not selected, add it to the selected buttons
    setSelectedButtons([...selectedButtons, button]);
  }
};

const handleSubmit = () => {
  const status = isLikeClicked ? 'liked' : 'disliked';
  const selectedButtonTexts = [...selectedButtons];
  const matchedMessageIndex = conversation.findIndex(msg => msg.content === content);
  const matchedMessage = conversation.find(msg => msg.content === content);
  
  try {
    if (matchedMessageIndex > 0) {
      const previousMessage = conversation[matchedMessageIndex - 1];
      const previousContent = previousMessage.content;
      if (matchedMessage) {
        const {  citation: previousCitation } = matchedMessage;
      
      // console.log('citation',previousCitation)
      axios.post(`${api}/api/like`, {
        content,
        userInput: previousContent,
        citation: previousCitation, 
        selectedButtons: selectedButtonTexts,
        additionalFeedback,
        status,
        userName: userName
      })
      .then(response => {
        // console.log('Success:', response.data);
        setOpenLikeDialog(false);
        setOpenDislikeDialog(false);
        setOpenSnackbar(true);
        setAdditionalFeedback('');
        const eventData = { event: 'ApiResponse', status: 'feedback response send successfully' };
        // Dispatch action to add tracking data to Redux store
        dispatch(addTrackingData(eventData));
      })
      .catch(error => {
        console.error('Error:', error);
        const eventData = { event: 'ApiResponse', status: 'feedback response send unsuccessful', errorMessage: error.message };
        // Dispatch action to add tracking data to Redux store
        dispatch(addTrackingData(eventData));
      });
    }
  }
  } catch (error) {
    console.error('Error:', error);
    const eventData = { event: 'ApiResponse', status: 'error occurred during feedback response sending', errorMessage: error.message };
    // Dispatch action to add tracking data to Redux store
    dispatch(addTrackingData(eventData));
  }
};



  return (
    <>
      <ThumbUpIcon
        onClick={handleLike}
        style={{
          width: "15px",
          color: isLikeClicked ? "blue" : "grey",
          cursor: "pointer",
          marginLeft: "8px",
          opacity: isLikeClicked ? 1 : 0.5,
        }}
      />

      <ThumbDownIcon
        onClick={handleDislike}
        style={{
          width: "15px",
          color: isDislikeClicked ? "red" : "grey",
          cursor: "pointer",
          marginLeft: "8px",
          opacity: isDislikeClicked ? 1 : 0.5,
        }}
      />

      <Dialog
        open={openLikeDialog}
        onClose={handleDialogClose}
        aria-labelledby="like-dialog-title"
        aria-describedby="like-dialog-description"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between",fontSize:"small" }}>
          <DialogTitle id="like-dialog-title">
           <Typography component='h1' variant="body2" style={{fontWeight:"700"}}>{t('whylike')}</Typography> 
          </DialogTitle>
          <Button onClick={handleDialogClose} color="primary">
            <CloseIcon fontSize="small" />
          </Button>
        </div>
        <DialogContent style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',overflow:'hidden'}}>
          <DialogContentText
            id="like-dialog-description"
            style={{ display: "flex", gap: "4px" }}
          >
            <Button
            className="btn"
              // variant="outlined"
              onClick={() => handleButtonSelect("Correct")}
              endIcon={selectedButtons.includes("Correct") ? <CheckIcon /> : null}
            >
              {t('correct')}
            </Button>
            <Button
              className="btn"
              // variant="outlined"
              onClick={() => handleButtonSelect("Complete")}
              endIcon={selectedButtons.includes("Complete") ? <CheckIcon /> : null}
            >
             {t('complete')}
            </Button>
            <Button
            className="btn"
              // variant="outlined"
              onClick={() => handleButtonSelect("Accurate")}
              endIcon={selectedButtons.includes("Accurate") ? <CheckIcon /> : null}
            >
              {t('accurate')}
            </Button>
          </DialogContentText>
          <input
            id="additional-feedback"
            style={{
              width: "100%",
              height: "7vh",
              marginTop: "8px",
              marginBottom: "10px",
              background: "white",
              borderRadius: "5px",
              border: "1px solid #3e98d3",
            }}
            value={additionalFeedback}
            onChange={(e) => setAdditionalFeedback(e.target.value)}
          />
          <Button className="btn"  style={{color:"blue"}} variant="filled" onClick={() => { handleSubmit(); handleDialogClose(); }}>
          {t('submit')}
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDislikeDialog}
        onClose={handleDialogClose}
        aria-labelledby="dislike-dialog-title"
        aria-describedby="dislike-dialog-description"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <DialogTitle id="dislike-dialog-title">
          <Typography component='h1' variant="body2" style={{fontWeight:"700"}}>{t('dislikethis')}</Typography>
          </DialogTitle>
          <Button onClick={handleDialogClose} color="primary">
            <CloseIcon  fontSize="small"/>
          </Button>
        </div>
        <DialogContent style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',overflow:'hidden'}}>
          <DialogContentText
            id="dislike-dialog-description"
            style={{ display: "flex", gap: "4px" }}
          >
            <Button
             className="btn"
              // variant="outlined"
              onClick={() => handleButtonSelect("Unsafe")}
              endIcon={selectedButtons.includes("Unsafe") ? <CheckIcon /> : null}
            >
              {t('unsafe')}
            </Button>
            <Button
             className="btn"
             style={{width:"fit-content"}}
             fullWidth
              // variant="outlined"
              onClick={() => handleButtonSelect("Not Factually Correct")}
              endIcon={selectedButtons.includes("Not Factually Correct") ? <CheckIcon /> : null}
            >
             {t('notcorrect')}
            </Button>
            <Button
             className="btn"
              onClick={() => handleButtonSelect("Incomplete")}
              endIcon={selectedButtons.includes("Incomplete") ? <CheckIcon /> : null}
            >
              {t('incomplete')}
          </Button>
          </DialogContentText>
          <input
            id="additional-feedback"
            style={{
              width: "100%",
              height: "7vh",
              marginTop: "8px",
              marginBottom: "10px",
              background: "white",
              borderRadius: "5px",
              border: "1px solid #3e98d3",
            }}
            value={additionalFeedback}
            onChange={(e) => setAdditionalFeedback(e.target.value)}
          />
          <Button className="btn"  style={{color:"blue"}} variant="filled"onClick={() => { handleSubmit(); handleDialogClose(); }}>
            {t('submit')}
          </Button>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
        message="Thanks for feedback"
        ContentProps={{
          style: {
            minWidth: "10px",
          },
        }}
      />
    </>
  );
}

export default LikeButton;