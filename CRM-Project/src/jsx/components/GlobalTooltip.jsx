import { Rnd } from "react-rnd";
import { useLocation } from "react-router-dom";
import { useState, memo } from "react";
import DemoImg from "../../images/Proposal/JKT-42292-Itenary-Downloa-000.jpg"
import DemoImgTwo from "../../images/Proposal/JKT-42292-Itenary-Downloa-004.jpg"


const handleDragStart = () => {
    document.body.style.userSelect = "none";
};

const handleDragStop = () => {
    document.body.style.userSelect = "";
};

const TravelInstitutionDemo = () => {
    return (
        <div className="container my-5">
            <header className="mb-5">
                <h1 className="display-4 text-center">Explore the World with Wanderlust Institute</h1>
                <p className="text-white lead text-center">
                    Your journey to global adventures starts here. Learn, travel, and grow.
                </p>
            </header>

            <section className="row mb-5">
                <div className="col-md-6">
                    <img
                        src={DemoImg}
                        alt="Travel"
                        className="img-fluid rounded shadow"
                    />
                </div>
                <div className="col-md-6">
                    <h2>About Wanderlust Institute</h2>
                    <p className="text-white">
                        Wanderlust Institute is a premier travel education and experience center
                        providing curated travel programs for explorers of all ages. Whether you
                        want to backpack through Europe, volunteer in Africa, or study ancient
                        cultures in Asia, we provide the knowledge and logistics to make it happen.
                    </p>
                </div>
            </section>

            <section className="mb-5">
                <h2 className="text-center mb-4">Popular Programs</h2>
                <div className="row g-4 mt-4">
                    <div className="col-md-4">
                        <div className="card h-100 shadow">
                            <img src={DemoImgTwo} className="card-img-top" alt="Paris" />
                            <div className="card-body">
                                <h5 className="card-title">Paris Cultural Immersion</h5>
                                <p className="text-white card-text">
                                    Discover the heart of French culture with our month-long immersion
                                    program. Includes local classes, cuisine, and guided museum visits.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 shadow">
                            <img src={DemoImgTwo} className="card-img-top" alt="Safari" />
                            <div className="card-body">
                                <h5 className="card-title">African Safari & Conservation</h5>
                                <p className="text-white card-text">
                                    Join our guided safaris and contribute to wildlife conservation in
                                    Kenya. Suitable for nature lovers and aspiring biologists.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 shadow">
                            <img src={DemoImgTwo} className="card-img-top" alt="Temple" />
                            <div className="card-body">
                                <h5 className="card-title">Ancient Civilizations Tour</h5>
                                <p className="text-white card-text">
                                    Explore the spiritual and historical wonders of Asia, from Angkor Wat
                                    to the Great Wall, guided by experienced archaeologists and monks.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="p-5 rounded text-black">
                <h2 className="mb-3">Why Choose Us?</h2>
                <ul className="list-unstyled">
                    <li><strong>✓ Expert Travel Educators:</strong> Learn from seasoned travelers and instructors.</li>
                    <li><strong>✓ Personalized Itineraries:</strong> Every journey is crafted for your interests.</li>
                    <li><strong>✓ Global Network:</strong> Join a community of learners and travelers from around the world.</li>
                    <li><strong>✓ Lifelong Impact:</strong> Transformative experiences that go beyond tourism.</li>
                </ul>
            </section>
        </div>
    );
};

const InstructionBox = memo(({ onClose, tooltipText }) => (
    <div style={{ position: 'fixed', zIndex: 9999, top: 80, left: "-4px" }}>
        <Rnd
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
            onResizeStart={handleDragStart}
            onResizeStop={handleDragStop}
            default={{
                x: window.innerWidth - 400,
                y: window.innerHeight - 300,
                width: 320,
                height: 200,
            }}
            minWidth={250}
            minHeight={150}
            bounds="window"
            className="instruction-box"
        >
            <div className="instruction-header">
                <span className="fs-5">Page Instructions</span>
                <button onClick={onClose}>✖</button>
            </div>
            <div className="instruction-content">
                {tooltipText}
            </div>
        </Rnd>
    </div>
));


const pageInstructions = {
    "/admin-dashboard": <TravelInstitutionDemo />,
    "/queries": "This section allows you to manage travel queries from clients.",
    "/mails": "Update your system settings and preferences here.",
};

const GlobalTooltip = () => {
    const location = useLocation();
    const [visible, setVisible] = useState(false);
    const tooltipText = pageInstructions[location.pathname] || "No instructions available for this page.";

    return (
        <>
            <div className="info-icon" onClick={() => setVisible(true)}>
                <i className="fas fa-info-circle fs-5"></i>
            </div>
            {visible && <InstructionBox tooltipText={tooltipText} onClose={() => setVisible(false)} />}
        </>
    );
}
export default GlobalTooltip;



