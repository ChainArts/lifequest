import { pageVariants, sectionVariants } from "../components/atoms/PageTransition/PageTransition";
import { motion } from "motion/react";
import ProfileSettings from "../components/organisms/ProfileSettings/ProfileSettings";
import StatsTeaser from "../components/organisms/StatsTeaser/StatsTeaser";
import { useState } from "react";
import { Sheet } from "react-modal-sheet";
import { HiOutlineX } from "react-icons/hi";
import { MdArrowForwardIos } from "react-icons/md";

const Profile = () => {
    const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
    return (
        <motion.main initial="initial" animate="in" exit="out" variants={pageVariants}>
            <motion.section variants={sectionVariants} className="container">
                <ProfileSettings />
            </motion.section>
            <motion.section variants={sectionVariants}>
                <StatsTeaser />
            </motion.section>
            <motion.section variants={sectionVariants} className="container">
                {/* Privacy Policy Button */}
                <button onClick={() => setPrivacyPolicyOpen(true)} className="privacy-policy-button">
                    Privacy Policy
                    <MdArrowForwardIos className="privacy-policy-button__icon" />
                </button>
            </motion.section>

            {/* Privacy Policy Modal */}
            <Sheet isOpen={privacyPolicyOpen} onClose={() => setPrivacyPolicyOpen(false)}>
                <Sheet.Container>
                    <Sheet.Header>
                        <div className="form-header">
                            <button type="button" onClick={() => setPrivacyPolicyOpen(false)}>
                                <HiOutlineX />
                            </button>
                            <h2>Privacy Policy</h2>
                        </div>
                    </Sheet.Header>
                    <Sheet.Content>
                        <Sheet.Scroller>
                            <div className="container privacy-policy-content">
                                <h3>Privacy Policy</h3>
                                <p>
                                    <strong>Effective Date:</strong> 29. May 2025
                                </p>

                                <p>Thank you for using our app. Your privacy is important to us. This Privacy Policy explains what data we collect, how we use it, and your rights regarding that data.</p>

                                <h4>1. Data Storage</h4>
                                <p>
                                    This application stores <strong>all user data locally on your device</strong>. We do <strong>not</strong> collect, store, or transmit any personal data to external servers.
                                </p>

                                <h4>2. Internet Access</h4>
                                <p>
                                    Our app accesses the internet <strong>only</strong> to retrieve emoji data from an external API. No personal or usage data is sent along with these requests.
                                </p>
                                <ul>
                                    <li>The API may receive your device's IP address as part of a standard internet request.</li>
                                    <li>We do not control or monitor how the emoji API provider processes this data. Please refer to their privacy policy for more details.</li>
                                </ul>

                                <h4>3. No Tracking</h4>
                                <p>
                                    We do <strong>not</strong> use cookies, analytics tools, or any form of tracking. Your activity within the app remains private and local.
                                </p>

                                <h4>4. Permissions</h4>
                                <p>
                                    The app does <strong>not</strong> request or require access to your contacts, files, camera, microphone, or any other sensitive system resources beyond what is necessary to function.
                                </p>

                                <h4>5. Your Rights</h4>
                                <p>Since we do not collect personal data, there is no data to access, update, or delete. All data resides on your device and can be cleared by uninstalling the app or deleting its local storage.</p>

                                <h4>6. Changes to This Policy</h4>
                                <p>We may update this Privacy Policy from time to time. Any changes will be posted within the app or on our website.</p>

                                <h4>Contact Us</h4>
                                <p>
                                    If you have any questions or concerns about this policy, please contact us at: <a href="mailto:[info@lifequestgame.app]">[info@lifequestgame.app]</a>
                                </p>
                            </div>
                        </Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={() => setPrivacyPolicyOpen(false)}/>
            </Sheet>
        </motion.main>
    );
};

export default Profile;
