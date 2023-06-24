import { NavLink} from 'react-router-dom';
import { Flex, Icon, Link, Text } from "@chakra-ui/react";

export default function NavBarItem({
  icon,
  title,
  routerLink
})
{
  return (
    //   Set some hover CSS in css file for ease of use
    <NavLink className={({isActive}) => (isActive ? 'active-Navlink' : 'not-Active-Navlink')  }  to={routerLink}>
    <Flex fontSize="lg" className="navbar-item"  color="gray.400" justifyContent="center" alignItems={"center"} mb={6} >
      <Link display={"center"}>
        <Icon display={["none", "none", "flex", "flex", "flex" ]}  className="navbar-item__icon" as={icon}      />
      </Link>
      <Link display={["flex", "flex", "none", "flex", "flex" ]} _hover={{ textDecor: "none" }} ml={3} >
        <Text fontSize={["md", "md", "xs", "xs", "md"]} color={ "grey.400" }>{title}</Text>
      </Link>
    </Flex>
    </NavLink>
  );
}
