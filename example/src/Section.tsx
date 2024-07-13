import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  line: {
    marginHorizontal: 10,
    flex: 1,
    height: 1,
    backgroundColor: 'silver',
  },
  bottomLine: {
    marginTop: 10,
  },
  title: {
    textAlign: 'center',
    marginTop: 10,
    color: '#2c2c2c',
  },
});

interface SectionProps {
  title: string;
  children: ReactNode;
}

const Section = ({ children, title }: SectionProps) => (
  <>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.line} />
    {children}
    <View style={[styles.line, styles.bottomLine]} />
  </>
);

export default Section;
