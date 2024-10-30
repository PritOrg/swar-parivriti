// Western musical notes and corresponding Gujarati notes
const westernNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const gujaratiNotes = ['સા', 'સા#', 'રે', 'રે#', 'ગ', 'મ', 'મ#', 'પ', 'પ#', 'ધ', 'ધ#', 'નિ'];

// Rajvi Special note mappings
const rajviNotes = {
    'S': 'C', 'S\'': 'C#', 'R': 'D', 'R\'': 'D#', 'G': 'E', 'M': 'F', 'M\'': 'F#',
    'P': 'G', 'P\'': 'G#', 'D': 'A', 'D\'': 'A#', 'N': 'B'
};
const rajviGujaratiNotes = {
    'S': 'સા', 'S\'': 'સા#', 'R': 'રે', 'R\'': 'રે#', 'G': 'ગ', 'M': 'મ', 'M\'': 'મ#',
    'P': 'પ', 'P\'': 'પ#', 'D': 'ધ', 'D\'': 'ધ#', 'N': 'નિ'
};

function processNotes(input) {
    // Split the input by spaces, and filter out ".", "..", and ","
    input = input.toUpperCase().split(/,/g).join(" ");
    let processedNotes = input
        .split(/\s+/) // Split by any whitespace
        .filter(note => note !== "." && note !== ".." && note !== ",") // Ignore ".", "..", ","
        

    return processedNotes;
}

// Transpose the song notes based on the scale difference
document.getElementById('transpose-button').addEventListener('click', () => {
    const originalScale = document.getElementById('original-scale').value;
    const fluteScale = document.getElementById('flute-scale').value;
    const inputNotes = document.getElementById('notes').value;
    const isRajviSpecial = document.getElementById('rajvi-special-switch').checked; // Switch for Rajvi Special mode

    // Calculate the interval (difference in semitones)
    const interval = (westernNotes.indexOf(fluteScale) - westernNotes.indexOf(originalScale) + 12) % 12;

    // Parse notes based on Rajvi Special format if enabled
    const parsedNotes = processNotes(inputNotes)

    // Convert Rajvi Special notes to Western notes if applicable
    const westernInputNotes = parsedNotes.map(note => isRajviSpecial ? rajviNotes[note] || note : note);

    // Transpose each note by the calculated interval
    const transposedNotes = westernInputNotes.map(note => {
        const originalIndex = westernNotes.indexOf(note);
        if (originalIndex === -1) return note; // Return as-is if invalid
        const newIndex = (originalIndex + interval) % westernNotes.length;
        return westernNotes[newIndex]; // Return transposed Western note
    });

    // Generate Gujarati equivalent
    const gujaratiEquivalent = transposedNotes.map(note => {
        const index = westernNotes.indexOf(note);
        return index !== -1 ? gujaratiNotes[index] : note;
    });

    // Display the result in both Western and Gujarati formats
    document.getElementById('result').innerHTML = `
        <strong>Transposed Western Notes:</strong><br> ${transposedNotes.join(" ... ")}<br>
        <strong>Gujarati Notes:</strong><br> ${gujaratiEquivalent.join(" ... ")}
    `;

    // Display SweetAlert2 Result
    Swal.fire({
        title: 'Transposed Notes!',
        html: `<strong>Western Notes:</strong><br /> ${transposedNotes.join(" ... ")}<br>
               <strong>Gujarati Notes:</strong><br /> ${gujaratiEquivalent.join(" ... ")}`,
        icon: 'success',
        confirmButtonText: '<i class="fas fa-copy"> Copy Notes'
    }).then(() => {
        // Copy result to clipboard on confirm
        const resultText = `Western Notes:\n ${transposedNotes.join(" ... ")}\nGujarati Notes:\n ${gujaratiEquivalent.join(" ... ")}`;
        navigator.clipboard.writeText(resultText);
    });
});

// Pre-fill example on page load for better UX
window.onload = () => {
    document.getElementById('notes').value = "C, D, E, F, G";
};
