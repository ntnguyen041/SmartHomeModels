import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, SIZES } from "../styles/theme";


export default function TermsConditions({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, padding: SIZES.background }}>
        <View style={styles.editProfileTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={30} color={COLORS.icon} />
          </TouchableOpacity>
          <Text style={styles.title}>Terms & Conditions</Text>
        </View>
        <View>
          <Text style={styles.titleBody}>Terms of Use</Text>
          <Text style={styles.subTitleBody}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
            facere iste tempore enim dolor explicabo? Quisquam, et excepturi,
            rem perspiciatis delectus odio quia atque ipsum quibusdam asperiores
            distinctio eum ducimus. Dignissimos quod accusantium maxime minus
            reiciendis in et impedit? Architecto officia suscipit alias
            laboriosam corporis voluptate totam cumque quod dolorem temporibus
            excepturi perferendis sint, pariatur modi quis explicabo aliquam
            minus!
          </Text>
          <Text style={styles.titleBody}>Company Policy</Text>
          <Text style={styles.subTitleBody}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ullam enim
            quidem quis quos repellendus numquam rerum iste delectus maxime
            cumque, cum libero deleniti, unde incidunt odio porro nihil
            provident? Voluptatibus! Molestias nesciunt fuga vitae veniam
            officia tempora ipsam earum dolores harum voluptatem, hic cupiditate
            itaque laudantium, doloremque molestiae magni saepe facilis esse,
            laborum suscipit iusto! Perspiciatis totam fugiat veniam voluptate?
            Neque atque dolores voluptates quod, ut aliquid dolor ipsum
            reiciendis ex perferendis omnis nobis assumenda ab quam! Ad in
            accusantium eaque unde excepturi eveniet nobis natus. Molestias
            voluptas inventore consectetur!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.background,
  },
  editProfileTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  editProfileCenter: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
    // backgroundColor: "blue",
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: "bold",
    color: COLORS.title,
    marginLeft: 10,
    marginBottom: 40,
  },
  titleBody: {
    fontSize: SIZES.background,
    fontWeight: "bold",
    color: COLORS.title,
    marginBottom: 10,
  },
  subTitleBody: {
    fontSize: 16,
    color: COLORS.subTitle,
    marginBottom: SIZES.background,
  },
});
