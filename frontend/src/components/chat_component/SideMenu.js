import { useState, useContext } from 'react';
import { Box, Button, Input, Text, Tooltip } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react';
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react';
import { ChatContext } from '../context/ChatProvider.js';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import ProfileModal from './misc/ProfileModal.js';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
// import ChatLoading from './misc/ChatLoading.js';

const SideMenu = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false);
    // const [loadingChat, setLoadingChat] = useState();

    const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();
    const { isOpen: isSearchBarOpen, onOpen: onSearchBarOpen, onClose: onSearchBarClose } = useDisclosure()
    const { user } = useContext(ChatContext);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Enter something to search",
                status: "warning",
                duration: "5000",
                isClosable: true,
                position: "top-left"
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config)
            console.log("data", data);
            setLoading(false)
            setSearchResult(data);

        } catch (e) {

        }
    }

    // const accessChat = (userId) => {

    // };

    return (
        <>
            <Box
                width={'100%'}
                p={2}
                bg={'white'}
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'space-between'}
            >
                <Tooltip 
                    label="Search users to chat"
                >
                    <Button onClick={onSearchBarOpen} >
                        <SearchIcon />
                        <Text>Search Users</Text>
                    </Button>
                </Tooltip>

                <Text fontSize='24px'>
                    ChatterTown
                </Text>

                <div>
                    <Menu>
                    <MenuButton as={Button} variant="ghost">
                        <BellIcon/>
                    </MenuButton>
                    <MenuList>
                        <MenuItem>M1</MenuItem>
                        <MenuItem>M2</MenuItem>
                    </MenuList>
                    </Menu>

                    <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        <Avatar size='sm' name={user.name} />
                    </MenuButton>
                    <MenuList>
                        <ProfileModal isProfileOpen={isProfileOpen} onProfileClose={onProfileClose} user={user}/>
                        <MenuItem onClick={onProfileOpen}>Profile</MenuItem>
                        <MenuDivider />
                        <MenuItem onClick={() => {
                            localStorage.removeItem('userInfo');
                            navigate('/');
                        }}>Logout</MenuItem>
                    </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer
                isOpen={isSearchBarOpen}
                placement='left'
                onClose={onSearchBarClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Search Users</DrawerHeader>

                <DrawerBody
                    display="flex"
                    flexDirection="row"
                >
                    <Box display="flex" flexDir={"row"}>
                        <Input onChange={(e) => setSearch(e.target.value)} mr={2} placeholder='Search by name or email' />
                        <Button onClick={handleSearch}>Go</Button>
                        {/* {loading 
                            ? <ChatLoading /> 
                            : searchResult?.map(user => {
                                <div>{user.name}</div>
                            })} */}
                    </Box>
                </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );

}

export default SideMenu