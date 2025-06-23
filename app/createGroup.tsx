import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Step1Image from "../components/create-group/Step1Image";
import Step2LocationPeople from "../components/create-group/Step2LocationPeople";
import Step3DatePicker from "../components/create-group/Step3DateSubmit";

export default function CreateGroupScreen() {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<{ uri: string } | null>(null);
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("4");
  const [interests, setInterests] = useState("");
  const [personality, setPersonality] = useState("");
  const [travelStyle, setTravelStyle] = useState("");

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  return (
    <View style={styles.container}>
      {step === 1 && (
        <Step1Image
          image={image}
          onImageSelected={setImage}
          onNext={handleNext}
          description={description}
          setDescription={setDescription}
          interests={interests}
          setInterests={setInterests}
          personality={personality}
          setPersonality={setPersonality}
          travelStyle={travelStyle}
          setTravelStyle={setTravelStyle}
        />
      )}
      {step === 2 && (
        <Step2LocationPeople
          destination={destination}
          setDestination={setDestination}
          numberOfPeople={numberOfPeople}
          setNumberOfPeople={setNumberOfPeople}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {step === 3 && (
        <Step3DatePicker
          image={image}
          destination={destination}
          numberOfPeople={numberOfPeople}
          description={description}
          onBack={handleBack}
          roomType={"public"} 
          interests={interests}
          personality={personality}
          travelStyle={travelStyle}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
