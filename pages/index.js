import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Icon,
  InputGroup,
  InputRightElement,
  Text,
  Box,
  Center,
} from "@chakra-ui/react";
import { Form as FormikForm, Formik } from "formik";
import * as Yup from "yup";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useState } from "react";
import { countries } from "../utils/countries";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  const initialValues = {
    firstName: "",
    lastName: "",
    country: "",
    email: "",
  };

  // countries validation
  const countryList = countries.map((country) => country.label);

  const validationSchema = Yup.object({
    country: Yup.string()
      .required("Country is required")
      .test("isValidCountry", "Country is invalid", (value) =>
        countryList.includes(value)
      ),
  });

  // Here I set a key so that the country picker will reset
  const [autocompleteKey, setAutocompleteKey] = useState(0);

  return (
    <div className={styles.container}>
      <Head>
        <title>AutoComplete Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box mt={12}>
        <Center m={12}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                resetForm();
                setSubmitting(false);
              }, 1000);
            }}
          >
            {({
              isSubmitting,
              values,
              handleBlur,
              handleChange,
              errors,
              touched,
              isValid,
              dirty,
              setFieldValue,
              handleSubmit,
            }) => (
              <FormikForm noValidate onSubmit={handleSubmit}>
                {/* country picker */}
                <FormControl
                  isInvalid={Boolean(errors.country) && touched.country}
                >
                  <AutoComplete
                    key={autocompleteKey}
                    openOnFocus
                    value={values.country}
                    onChange={(vals) => {
                      vals && setFieldValue("country", vals);
                    }}
                  >
                    {({ isOpen }) => (
                      <>
                        <InputGroup>
                          <AutoCompleteInput
                            value={values.country}
                            onChange={handleChange("country")}
                            onBlur={handleBlur("country")}
                            placeholder={"Country"}
                            autoComplete="new-password"
                          />
                          <InputRightElement height={"100%"}>
                            <Icon
                              as={isOpen ? ChevronUpIcon : ChevronDownIcon}
                            />
                          </InputRightElement>
                        </InputGroup>
                        <AutoCompleteList>
                          {countries.map((country) => (
                            <AutoCompleteItem
                              key={country.label}
                              value={`${country.label}`}
                              label={country.label}
                              display="flex"
                              alignItems={"center"}
                              bgColor={"white"}
                            >
                              <img
                                loading="lazy"
                                src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                                srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
                                alt=""
                              />
                              <Text ml={3} size={"xs"}>
                                {country.label}
                              </Text>
                            </AutoCompleteItem>
                          ))}
                        </AutoCompleteList>
                      </>
                    )}
                  </AutoComplete>

                  <FormErrorMessage>{errors.country}</FormErrorMessage>
                </FormControl>
                <Button
                  size={"lg"}
                  isLoading={isSubmitting}
                  disabled={!isValid || !dirty}
                  onClick={() => {
                    handleSubmit();
                    // I commented the next line out to show how when you don't change the key the item that was selected before would appear in the country input after submissio
                    // setAutocompleteKey((prevKey) => prevKey + 1);
                  }}
                >
                  Submit here
                </Button>
              </FormikForm>
            )}
          </Formik>
        </Center>
      </Box>
    </div>
  );
}
