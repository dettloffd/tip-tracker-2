import React, { useState } from "react";
//
import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";
//
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
//
import { AuthContext } from "./auth/AuthContext";
import { useAuthHook } from "./hooks/useAuthHook";
import EntryInputForm from "./entries/components/EntryInputForm";
import EntryLog from "./entries/components/EntryLog";
import HeatMap from "./entries/components/HeatMap";
import EntryPage from "./entries/pages/EntryPage";
import StatsDisplay from "./stats/pages/StatsDisplay";
import StatsPage from "./stats/pages/StatsPage";
import NavBar from "./UIElements/NavBar";
import DateRangeSelector from "./util/DateRangeSelector";
import Auth from "./auth/Auth";

const AppHome = () => {
  const { token, login, logout, userId } = useAuthHook();
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Flex
                w={["80%", "80%", "35%", "35%", "35%"]}
                p="1.25%"
                flexDir="column"
                bg="gray.100"
                mt={"5rem"}
                alignSelf={["center", "center", "flex-start"]}
              >
                <EntryInputForm />

                <Box
                  bg={"white"}
                  m={3}
                  boxShadow="lg"
                  p={4}
                  borderRadius="lg"
                  fontSize={["md", "md", "xl"]}
                >
                  <Flex
                    justifyContent={"space-between"}
                    p={3}
                    mt={3}
                    mb={1}
                    bg="white"
                  >
                    <Text fontSize={["md", "md", "xl"]}>Recent Entries</Text>{" "}
                    <Link to="/entries">
                      <Text
                        fontSize={["md", "md", "lg"]}
                        fontWeight={"bold"}
                        color="teal.500"
                      >
                        See All
                      </Text>
                    </Link>
                  </Flex>
                  <Divider mb={5} />
                  {/* <EntryLog
                    numResults={10}
                    dateRange={{ startDate: "", endDate: "" }}
                  /> */}
                </Box>
              </Flex>

              <Flex
                flexDir="column"
                minH="100vh"
                p="1% 2% 1% 1%"
                w={["90%", "90%", "55%", "55%", "55%"]}
                bg="gray.100"
                mt={"5rem"}
                alignSelf={["center", "center", "flex-start"]}
              >
                <Flex
                  p={5}
                  justifyContent={"center"}
                  alignItems="center"
                  bgColor={"white"}
                  flexDir="column"
                  boxShadow="md"
                  borderRadius={"lg"}
                >
                  <HeatMap
                    mapwidth="82%"
                    mapheight="20rem"
                    numDays={100}
                  ></HeatMap>
                </Flex>

                <Flex
                  bg="white"
                  boxShadow="lg"
                  borderRadius={"lg"}
                  direction={"column"}
                  alignItems="center"
                  m={2}
                >
                  <DateRangeSelector
                    setDateRange={setDateRange}
                    dateRange={dateRange}
                  />
                </Flex>

                <StatsDisplay dateRange={dateRange} />
              </Flex>
            </>
          }
        />

        <Route
          path="/entries"
          element={
            <Flex w={["100%", "100%", "90%"]}>
              {/* If page is in vertical mode, take up 100% of width */}
              <EntryPage numResults={30} />
            </Flex>
          }
        />

        <Route
          path="/statspage"
          element={
            <Flex w={["100%", "100%", "90%"]}>
              {/* If page is in vertical mode, take up 100% of width */}
              <StatsPage />
            </Flex>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route
          path="/auth"
          element={
            <Flex w={["100%", "100%", "90%"]}>
              {/* If page is in vertical mode, take up 100% of width */}
              <Auth />
            </Flex>
          }
        />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        logout: logout,
        userId: userId,
      }}
    >
      <BrowserRouter>
        <Flex
          flexDir={["column", "column", "row"]}
          maxWidth={"155rem"}
          minH="100vh"
        >
          {/* col1 */}
          <Flex
            backgroundColor="#252627"
            w={["100%", "100%", "10%", "10%", "10%"]}
            pos="relative"
            justifyContent={"center"}
            className="navbar-container"
          >
            <Flex
              pos={[null, null, "fixed", "fixed", "fixed"]}
              justifyContent={"space-between"}
              flexDir={["column", "column", "column"]}
              alignItems="center"
              className="sticky-navbar-component"
              w={["100%", "100%", "10%", "10%", "10%"]}
              h={"80%"}
              // Height controls how far down the page the logout button goes
            >
              <NavBar />
              <Button
                onClick={logout}
                mb={2}
                size={"xs"}
                display={token ? "inline-flex" : "none"}
              >
                Logout
              </Button>
            </Flex>
          </Flex>
          {routes}
        </Flex>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default AppHome;
