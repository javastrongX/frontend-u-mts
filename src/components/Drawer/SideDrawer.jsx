import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import Sidenav from "../Navigations/SideNav";

const SideDrawer = ({ isOpen, onClose }) => {

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />

        <DrawerBody>
          <Sidenav />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;