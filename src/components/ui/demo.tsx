import AvatarGroup from "@/components/ui/avatar-group";
import azimImg from "@/assets/Azim A.jpeg";
import bhagathImg from "@/assets/D Bhagath Bhaskar Unnithan.jpeg";
import nevinImg from "@/assets/Nevin zachariah Muthalaly.jpeg";

export default function DemoOne() {
  return (
    <AvatarGroup
      items={[
        {
          id: 1,
          name: "Azim A",
          designation: "Software Engineer",
          image: azimImg,
        },
        {
          id: 2,
          name: "D Bhagath Bhaskar Unnithan",
          designation: "Product Manager",
          image: bhagathImg,
        },
        {
          id: 3,
          name: "Nevin zachariah Muthalaly",
          designation: "Marketing Manager",
          image: nevinImg,
        },
        {
          id: 4,
          name: "John Doe",
          designation: "Software Engineer",
          image: "https://randomuser.me/api/portraits/men/63.jpg",
        },
        {
          id: 5,
          name: "Jane Smith",
          designation: "Designer",
          image: "https://randomuser.me/api/portraits/men/64.jpg",
        },
        {
          id: 6,
          name: "Jim Beam",
          designation: "DevOps",
          image: "https://randomuser.me/api/portraits/men/65.jpg",
        },
      ]}
      maxVisible={5}
      size="md"
    />
  );
}
