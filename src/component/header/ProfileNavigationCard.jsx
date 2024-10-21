import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  styled,
  IconButton,
  Divider,
} from '@mui/material';
import { useState, useCallback,useEffect } from 'react';
import { Edit, Settings, ExitToApp, PhotoCamera } from '@mui/icons-material';
import axios from 'axios';
import Setting from './Setting';
import { authProvider } from '../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { BlobServiceClient } from '@azure/storage-blob';



// ProfileNavigationCard component renders a user profile card with various actions
// It displays user information such as profile image, username, and email
// It allows users to upload a profile image, access settings, and sign out

const RoundedButton = styled(Button)({
  borderRadius: 32,
});

const ProfileAvatar = styled(Avatar)({
  width: 50,
  height: 50,
  backgroundColor: 'blue',
  fontSize: '12px',
});

const ProfileCard = styled(Box)({
  width: 300,
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: 16,
  overflow: 'hidden',
  textAlign: 'center',
  backgroundColor: 'white',
});

const Header = styled(Box)({
  backgroundColor: '#d3e3fd',
  padding: '35px 0',
  position: 'relative',
});

const UserName = styled(Typography)({
  marginTop: 16,
  fontWeight: 'bold',
});

const UserAccountName = styled(Typography)({
  color: 'gray',
});

const IconContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 16,
});

const ProfileIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: '#f5d5a4',
  margin: '0 8px',
});

export function ProfileNavigationCard(props) {
  const { t } = useTranslation();
  const [askingSignOut, setAskingSignout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [userProfile,setUserProfile] = useState('')

  const handlerInputChange = (event) => {
    let files = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (e) => {
      updateImage(e.target?.result);
    };
  };

  const token = localStorage.getItem('token');

  const updateImage = (fileData) => {
    const formData = { file: fileData, name: 'name' };
    setIsLoading(true);
    if (token) {
      axios
        .post(`/api/s3/upload`, formData, {
          headers: { Authorization: token },
        })
        .then((updres) => {
          axios
            .put('/api/user/image', { imgUrl: updres.data }, {
              headers: { Authorization: token },
            })
            .then(() => {
              axios
                .get('/api/user/info', { headers: { Authorization: token } })
                .then((res2) => {
                  // Update the user info state here if needed
                  setIsLoading(false);
                  alert('Profile picture updated successfully');
                });
            })
            .catch((err) => {
              console.log('Error:', err.response.data);
              setIsLoading(false);
              alert('Something went wrong!');
            });
        })
        .catch((err) => {
          console.log('Error:', err.response.data);
          setIsLoading(false);
          alert('Something went wrong!');
        });
    }
  };

  const onSignOut = useCallback(() => {
    setAskingSignout(false);
    localStorage.clear();
    // Perform sign-out logic
    authProvider.logout();
  }, []);

  const info = props.info || {};
  const account = info.account || {};
  const userName = info.name || '';
  var email = account.userName || '';
  const emailFirstWord = email.split('@')[0];
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const storageAccountName = 'glamblobstorage';
  const sasToken = "sp=racwdli&st=2024-09-19T06:43:22Z&se=2026-02-02T14:43:22Z&spr=https&sv=2022-11-02&sr=c&sig=w9My5xhMgS7JvCFGaJxzb4sPuRWIW15PM1YcE8aIbMw%3D";
  const containerName = 'userimagecontainer';
  const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`;

  const blobServiceClient = new BlobServiceClient(uploadUrl);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  try {
    // Use `userName` from the profile info as part of the blob name
    const blobName = `${email}-${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    setIsLoading(true);
    await blockBlobClient.uploadBrowserData(file);

    // Get the uploaded file's URL
    const uploadedFileUrl = blockBlobClient.url;

    // Store the URL in localStorage and update the user profile
    localStorage.setItem('profileImageUrl', uploadedFileUrl);

    setUserProfile((prevProfile) => ({
      ...prevProfile,
      profileImageUrl: uploadedFileUrl,
    }));



  } catch (error) {
    console.error('Error uploading file:', error);
    setIsLoading(false);
    alert('Something went wrong while uploading the image.');
  }
};
useEffect(() => {
  const fetchProfileImage = async () => {
    try {
      // Step 1: Check if profileImageUrl exists in localStorage
      let profileImageUrl = localStorage.getItem('profileImageUrl');
      
      if (!profileImageUrl) {
        // Step 2: Generate the blob URL dynamically based on the user email or name
        const storageAccountName = 'glamblobstorage';
        const containerName = 'userimagecontainer';
        const fileExtension = 'png'; // Assuming .png extension, change if required
        const blobName = `${email}-profile-image.${fileExtension}`;
        profileImageUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}`;
       localStorage.setItem('profileImageUrl', profileImageUrl);


        // Step 3: Check if the image exists in Blob Storage
        const response = await fetch(profileImageUrl, { method: 'HEAD' });
        
        if (!response.ok) {
          // If image doesn't exist in Blob Storage, fallback to default image
          profileImageUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        } else {
          // Store the fetched Blob URL in localStorage for future use
          localStorage.setItem('profileImageUrl', profileImageUrl);
        }
      }

      // Step 4: Update the user profile with the final profileImageUrl
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        profileImageUrl,
      }));

    } catch (error) {
      console.error('Error fetching profile image:', error);
      // If something goes wrong, fallback to default image
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        profileImageUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      }));
    }
  };

  fetchProfileImage();
}, [email]); // Depends on the user's email (or other unique identifier)

  const profileImageUrl = localStorage.getItem('profileImageUrl') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';


  return (
    <>
      <ProfileCard>
        <Header>
         {/* Handles file uploads using Azure Blob storage and updates the profile image */}
        </Header>
        <Box display="flex" flexDirection="column" alignItems="center" position="relative" mt="-40px" >
          <Avatar
            src={userProfile.profileImageUrl}
            alt="User Profile"
            sx={{
              width: 80,
              height: 80,
              marginBottom: '10px',
              border: '3px solid #001a4b',
              boxShadow: '0px 4px 10px rgb(0, 0, 34, 0.3)',
              backgroundColor: 'white'
            }}
          />
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{
              position: 'absolute',
              top: '28%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '50%',
              opacity: 0, // Start with hidden
              transition: 'opacity 0.3s ease-in-out', // Smooth transition
              '&:hover': {
                opacity: 1, // Show on hover
              },
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <input hidden accept="image/png, image/gif, image/jpeg" type="file" onChange={handleFileUpload} />
            <PhotoCamera />
          </IconButton>

          <UserName variant="h6" style={{ margin: '0' }}>{userName}</UserName>
          <UserAccountName variant="body2">{email}</UserAccountName>
          <Typography variant="h6">{emailFirstWord}</Typography>

        </Box>
        <Divider />
         {/* Includes dialog modals for settings and sign-out confirmation */}

        <Box sx={{ display: 'flex' }}>
          <RoundedButton
            onClick={() => setSettingOpen(true)}
            startIcon={<Settings />}
            fullWidth
            sx={{ mt: 1 }}
          >
            {t('setting')}
          </RoundedButton>
          <RoundedButton
            onClick={() => setAskingSignout(true)}
            startIcon={<ExitToApp />}
            fullWidth
            sx={{ mt: 1 }}
          >
            {t('signout')}
          </RoundedButton>
        </Box>
        <Dialog open={askingSignOut} onClose={() => setAskingSignout(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('signout')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('signoutconfirm')}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="primary" onClick={() => setAskingSignout(false)}>
              {t('cancel')}
            </Button>
            <Button variant="contained" color="primary" onClick={onSignOut}>
              {t('yes')}, {t('signout')}
            </Button>
          </DialogActions>
        </Dialog>
        <Setting open={settingOpen} handleClose={() => setSettingOpen(false)} />
      </ProfileCard>
    </>
  );
}
